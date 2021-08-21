#!/usr/bin/env ocaml
(* The OCaml toplevel, version 4.12.0 *)

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

let diff_char_indexes id_x id_y =
  let xs = List.of_seq (String.to_seq id_x) in
  let ys = List.of_seq (String.to_seq id_y) in
  let pair_list = List.combine xs ys in
  let mapped_diff_index_list =
    List.mapi (
      fun i pair -> let (x, y) = pair in
      if x != y then Some(i) else None
    ) (pair_list)
  in
  let filtered_diff_index_list =
    List.filter (
      fun option_i -> match option_i with Some i -> true | None -> false
    ) mapped_diff_index_list
  in
  List.map (fun i -> match i with Some i -> i | None -> -1) filtered_diff_index_list

(*
function *triangle_stream (ids) {
  for(const a of ids) {
    for(const b of ids) {
      if(a !== b) {
        yield Pair(a, b)
      }
    }
  }
}
*)
let triangle_stream ids =
  let pairs = ref [] in
  let next i =
    match !pairs with h :: t -> pairs := t; Some(h) | [] -> None
  in
  List.iteri (
    fun i s -> List.iteri(
        fun j t -> pairs := (s, t) :: !pairs
      ) (List.filteri (fun k _ -> k > i) ids)
  ) ids;
  Stream.from next

let string_splice_1 pos s =
  let char_list = List.of_seq (String.to_seq s) in
  let filtered = List.filteri (fun i char -> i != pos) char_list in
  List.fold_left (fun s c -> s ^ String.make 1 c) "" filtered

let answer2 = stream_fold (
  fun acc pair ->
    let (id_x, id_y) = pair in
    let indexes = diff_char_indexes id_x id_y in
    match acc with
    | Some a -> acc
    | None -> if List.length indexes == 1 then Some(string_splice_1 (List.hd indexes) id_x) else None
) None (triangle_stream lines)

let () = Printf.printf "answer 2: %s\n" (match answer2 with Some a -> a | None -> "")

