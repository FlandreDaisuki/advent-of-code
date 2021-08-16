#!/usr/bin/env ocaml

(* https://stackoverflow.com/a/23456034/7768661 *)
let read_lines name : string list =
  let ic = open_in name in
  let try_read () =
    try Some (input_line ic) with End_of_file -> None in
  let rec loop acc = match try_read () with
    | Some s -> loop (s :: acc)
    | None -> close_in ic; List.rev acc in
  loop []

let lines = read_lines "day01.txt"
let int_list = List.map int_of_string lines

let answer1 = List.fold_left ( + ) 0 int_list
let () = Printf.printf "answer 1: %d\n" answer1
