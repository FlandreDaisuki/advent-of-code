#!/usr/bin/env ocaml
(* The OCaml toplevel, version 4.12.0 *)

open Printf

let line_stream_of_channel channel =
  Stream.from (fun _ ->
    try Some (input_line channel) with End_of_file -> None)

let stream_fold f init stream =
  let result = ref init in
  Stream.iter
    (fun x -> result := f !result x)
    stream;
  !result

let lines =
  let line_stream = line_stream_of_channel (open_in "day03.txt") in
  stream_fold (fun acc i -> acc @ [i]) [] line_stream

(*
let out = str_split_by_first_char 'c' "abcdefgh" ;;
val out : string * string = ("ab", "defgh")
*)
let str_split_by_first_char ch s =
  let len = String.length s in
  let i = String.index s ch in
  (String.sub s 0 i, String.sub s (i+1) (len-i-1))

type point = {
  x: int; y: int;
}
module PointSet = Set.Make(struct
  type t = point
  let compare a b = if a.x != b.x then a.x - b.x else a.y - b.y
end)

type claim = {
  id: int;
  x: int; y: int;
  w: int; h: int;
}

let transform_to_claim line =
  (* /^#(\d+) @ (\d+),(\d+): (\d+)x(\d+)$/ *)
  let (_, rest) = str_split_by_first_char '#' line in
  let (id, rest) = str_split_by_first_char '@' rest in
  let (x, rest) = str_split_by_first_char ',' rest in
  let (y, rest) = str_split_by_first_char ':' rest in
  let (w, h) = str_split_by_first_char 'x' rest in
  let f s = s |> String.trim |> int_of_string in
  {id = f id; x = f x; y = f y; w = f w; h = f h}

let claim_field claim =
  let axis_x = List.init claim.w (Int.add claim.x) in
  let axis_y = List.init claim.h (Int.add claim.y) in
  let points =
    List.fold_left (
      fun acc x -> List.map (fun y -> {x = x; y = y}) axis_y @ acc
    ) [] axis_x
  in
  PointSet.of_list points

let fields = List.map (fun line -> line |> transform_to_claim |> claim_field) lines

let field_intersections =
  List.mapi (
    fun i field_a ->
      let rest_fields = List.filteri (fun j _ -> j > i) fields in
      List.map (fun field_b -> PointSet.inter field_a field_b) rest_fields
  ) fields |> List.flatten

let overlaps = List.fold_left (PointSet.union) PointSet.empty field_intersections

let answer1 = PointSet.cardinal overlaps

let () = printf "answer 1: %d\n" answer1
