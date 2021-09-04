#!/usr/bin/env ocaml
(* The OCaml toplevel, version 4.12.0 *)

open Printf;;

let line_stream_of_channel channel =
  Stream.from (fun _ ->
    try Some (input_line channel) with End_of_file -> None)
;;

let stream_map ~f stream =
  let rec next i =
    try Some (f (Stream.next stream))
    with Stream.Failure -> None in
  Stream.from next
;;

let stream_fold ~f ~init stream =
  let result = ref init in
  Stream.iter
    (fun x -> result := f !result x)
    stream;
  !result
;;

let transform line = Scanf.sscanf line
  "Step %c must be finished before step %c can begin."
  (fun hd tl -> (hd, tl))
;;

let pairs =
  let line_stream = line_stream_of_channel (open_in "day07.txt") in
  let transformed_line_stream = stream_map line_stream ~f: transform in
  stream_fold transformed_line_stream ~init:[] ~f: (fun acc i -> acc @ [i])
;;

module CharSet = Set.Make(Char);;
module CharMap = Map.Make(Char);;

let all_chars =
  let reducer set (first, second) = CharSet.(union set (of_list [first; second])) in
  CharSet.elements (List.fold_left reducer CharSet.empty pairs)
;;

let char_by_pairs_map =
  List.fold_left (fun map ch ->
    let has_char_pairs =
      List.find_all (fun (first, second) -> first == ch || second == ch) pairs
    in
    CharMap.add ch has_char_pairs map
  ) CharMap.empty all_chars
;;

let root_chars =
  List.filter (fun ch ->
    let has_char_pairs = CharMap.find ch char_by_pairs_map in
    List.for_all (fun pair -> ch == (fst pair)) has_char_pairs
  ) all_chars
;;

let rec walk_steps ready output =
  if List.(length output == length all_chars) then
    output
  else
    match ready with
    | [] -> output
    | hd :: rest -> (
      let output' = output @ [hd] in
      let not_in_output'_chars = all_chars |> List.filter (fun ch -> not (List.mem ch output')) in
      let avalible_steps =
        List.filter (fun ch ->
          let char_pairs = CharMap.find ch char_by_pairs_map in
          let end_of_char_pairs = List.filter (fun (_, second) -> second == ch) char_pairs in
          List.for_all (fun (first, _) -> List.mem first output') end_of_char_pairs
        ) not_in_output'_chars
      in
      let ready' = (avalible_steps @ rest) |> CharSet.of_list |> CharSet.elements in
      walk_steps ready' output'
    )
;;

let answer1 = (walk_steps root_chars []) |> List.to_seq |> String.of_seq;;

let () = printf "answer 1: %s\n" answer1;;

