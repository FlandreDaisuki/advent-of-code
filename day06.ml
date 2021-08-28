#!/usr/bin/env -S ocaml str.cma
(* The OCaml toplevel, version 4.12.0 *)

(* The following line will make ocaml-lsp-server unhappy but it's work. *)
(* #load "str.cma";; *)

open Printf;;

let line_stream_of_channel channel =
  Stream.from (fun _ ->
    try Some (input_line channel) with End_of_file -> None)
;;

let stream_fold f init stream =
  let result = ref init in
  Stream.iter
    (fun x -> result := f !result x)
    stream;
  !result
;;

let lines =
  let line_stream = line_stream_of_channel (open_in "day06.txt") in
  stream_fold (fun acc i -> acc @ [i]) [] line_stream
;;

module Point = struct
  type t = {x: int; y: int}
  let init (x, y) = { x = x; y = y }
  let init1 x = init (x, x)
  let origin = init1 0
  let to_string p = sprintf "(%3d, %3d)" p.x p.y
  let distance p q = abs (p.x - q.x) + abs (p.y - q.y)
  let equal p q = distance p q == 0
  let compare p q = let dx = p.x - q.x in if dx != 0 then dx else p.y - q.y
end

let points = List.map (fun line ->
  let regex = Str.regexp ", " in
  let splitted = Str.split regex line in
  let ints = List.map int_of_string splitted in
  match ints with
  | x :: y :: _ -> Point.init (x, y)
  | _ -> Point.origin
) lines
;;

(* x→ y↓ *)
module Area = struct
  (* left_top ; right_bottom *)
  type t = {lt: Point.t; rb: Point.t}
  let init (lt, rb) = { lt = lt; rb = rb }
  let empty = init (Point.init1 max_int, Point.init1 min_int)
  let width a = a.rb.x - a.lt.x + 1
  let height a = a.rb.y - a.lt.y + 1
  let union (a: t) (p: Point.t) = {
    lt = Point.init (min a.lt.x p.x, min a.lt.y p.y);
    rb = Point.init (max a.rb.x p.x, max a.rb.y p.y)
  }
  let is_border (a: t) (p: Point.t) =
    p.x == a.lt.x ||
    p.x == a.rb.x ||
    p.y == a.lt.y ||
    p.y == a.rb.y
  let to_points (a: t) =
    let ys = List.init (height a) (Int.add a.lt.y) in
    let xs = List.init (width a) (Int.add a.lt.x) in
    List.fold_left (fun points y ->
      points @ List.map (fun x -> Point.init (x, y)) xs
    ) [] ys
end

let finite_area = List.fold_left (Area.union) Area.empty points
;;

type world_point_status = Occupied of Point.t | Dead
type world_point = {
  position: Point.t;
  nearest: world_point_status;
  distance: int;
}
let print_world world =
  List.iter (fun wp ->
    printf "p%s %s %d\n"
    (Point.to_string wp.position)
    (match wp.nearest with Dead -> "Dead" | Occupied p -> Point.to_string p)
    (wp.distance)
  ) world
;;
let world =
  let init_world =
    Area.to_points finite_area
    |> List.map (fun point -> { position = point; nearest = Occupied(Point.origin); distance = max_int })
  in
  List.map (fun wp ->
    let distance_by p = Point.distance wp.position p in
    List.fold_left (fun best_wp point->
      let d = distance_by point in
      if d < best_wp.distance then
        { position = best_wp.position; nearest = Occupied(point); distance = d}
      else if d == best_wp.distance then
        { position = best_wp.position; nearest = Dead; distance = d}
      else
        best_wp
      ) wp points
    ) init_world
;;

module PointByCountMap = Map.Make(Point);;

let occupied_border_points =
  world
  |> List.filter (fun wp ->
    match wp.nearest with
    | Dead -> false
    | Occupied _ -> (Area.is_border finite_area wp.position)
  )
  |> List.map (fun wp ->
    match wp.nearest with
    | Dead -> Point.origin (* just make compiler happy *)
    | Occupied occupier -> occupier
  )
  |> List.sort_uniq Point.compare
;;

let answer1 =
  let finite_world =
      List.filter (fun wp ->
      match wp.nearest with
      | Dead -> false
      | Occupied occupier -> not (List.exists (fun obp -> Point.equal obp occupier) occupied_border_points)
    ) world
  in
  let occupier_histogram =
    List.fold_left (fun counter wp ->
      match wp.nearest with
      | Dead -> counter
      | Occupied occupier ->
        PointByCountMap.update occupier (fun count ->
          match count with Some n -> Some(n+1) | None -> Some(1)
        ) counter
    ) PointByCountMap.empty finite_world
  in
  List.fold_left (fun maximum (_, count) ->
    max maximum count
  ) min_int (PointByCountMap.bindings occupier_histogram)
;;

let () = printf "answer 1: %d\n" answer1;;
(*
let answer2 = (* Stack overflow during evaluation *)
  let finite_area_points = Area.to_points finite_area in
  let sum_distance_world_init = List.init (List.length finite_area_points) (fun _ -> 0) in
  let distance_worlds =
    List.map (fun point ->
      List.map (Point.distance point) finite_area_points
    ) points
  in
  let sum_distance_world =
    List.fold_left (List.map2 (+)) sum_distance_world_init distance_worlds
  in
  sum_distance_world
  |> List.filter (fun d -> d < 10000)
  |> List.length
;;
*)

let answer2_mut =
  let finite_area_points = Area.to_points finite_area in
  let sum_distance_world = Array.init (List.length finite_area_points) (fun _ -> 0) in
  let distance_worlds =
    List.map (fun point ->
      List.map (Point.distance point) finite_area_points
    ) points
  in
  List.iter (fun distance_world ->
    List.iteri (fun i d ->
      sum_distance_world.(i) <- sum_distance_world.(i) + d;
    ) distance_world
  ) distance_worlds;

  sum_distance_world
  |> Array.to_list
  |> List.filter (fun d -> d < 10000)
  |> List.length

let () = printf "answer 2: %d\n" answer2_mut;;
