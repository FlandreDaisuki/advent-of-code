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

let line =
  let line_stream = line_stream_of_channel (open_in "day05.txt") in
  stream_fold (fun acc i -> acc ^ i) "" line_stream
;;

(* # partition_at_index 1 "abcde";; *)
(* - : string * string = ("a", "bcde") *)
let partition_at_index i s =
  let len = String.length s in
  String.(sub s 0 i, sub s i (len - i))
;;

module String = struct
  include String;;
  let last_char s = s.[(length s - 1)]
  let pop_last s = Str.string_before s (length s - 1)
  let pop_first s = Str.string_after s 1
end

let rec reduce i s =
  let (l_str, r_str) = partition_at_index i s in
  let l_len = String.length l_str in
  let r_len = String.length r_str in
  if r_len == 0 then
    l_str
  else if l_len == 0 then
    reduce (i + 1) s
  else
    let l_char = String.last_char l_str in
    let r_char = r_str.[0] in
    let diff = Char.(code l_char - code r_char) in
    if (Int.abs diff) == 32 then
      reduce (i - 1) String.(pop_last l_str ^ pop_first r_str)
    else
      reduce (i + 1) s
;;

let answer1 = String.length(reduce 0 line)
;;

let () = printf "answer 1: %d\n" answer1
;;
