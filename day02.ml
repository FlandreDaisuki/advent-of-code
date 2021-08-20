#!/usr/bin/env ocaml

let line_stream_of_channel channel =
  Stream.from (fun _ ->
    try Some (input_line channel) with End_of_file -> None)

let stream_fold f init stream =
  let result = ref init in
  Stream.iter
    (fun x -> result := f !result x)
    stream;
  !result

let line_stream = line_stream_of_channel (open_in "day02.txt")
let lines = stream_fold (fun acc i -> acc @ [i]) [] line_stream

module CharMap = Map.Make(Char)

let get_hist_or_zero key hist =
  match CharMap.find_opt key hist with
    | Some v -> v
    | None -> 0

let has_freq_n n box_id =
  let hist = CharMap.empty in
  let char_seq = String.to_seq box_id in
  let histogram = Seq.fold_left (fun h c -> CharMap.add c (get_hist_or_zero c h + 1) h) hist char_seq in
  CharMap.exists (fun _ c -> c == n) histogram

let freq_n_count n = List.fold_left (
  fun count line -> if has_freq_n n line then count + 1 else count
) 0 lines

let () = Printf.printf "answer 1: %d\n" ((freq_n_count 2) * (freq_n_count 3))
