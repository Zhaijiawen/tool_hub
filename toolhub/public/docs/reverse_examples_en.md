# Text Reversal — Examples

## Checking for palindromes

Character reversal gives you an instant palindrome check. If the reversed text matches the original, you've got one.

**Input:** `racecar`
**Reversed:** `racecar`
Result: It's a palindrome.

**Input:** `hello`
**Reversed:** `olleh`
Result: Not a palindrome — the reversed string is visibly different.

For real palindrome detection you'd normally strip spaces and punctuation first. `A man, a plan, a canal: Panama` reversed character-by-character is `amanaP :lanac a ,nalp a ,nam A` — not a match. But after stripping non-letters and lowercasing, it's `amanaplanacanalpanama`, which is its own reverse. The reversal tool gives you the raw flip; normalization is on you.

## Flipping name order

This is word reversal at its most practical. Drop in a list of full names and get last-name-first output instantly.

**Input:**
```
John Smith
Jane Doe
Bob Johnson
```
**Reverse Words Output:**
```
Smith John
Doe Jane
Johnson Bob
```

Each line is handled separately, so a multi-line list of names processes cleanly. No need for a spreadsheet formula or a script — paste, click, copy.

## Seeing recent log entries first

Log files accumulate with the newest entries at the end. Line reversal puts the freshest data at the top.

**Input:**
```
2024-01-01 Server started
2024-01-02 Request received
2024-01-03 Error occurred
```
**Reverse Lines Output:**
```
2024-01-03 Error occurred
2024-01-02 Request received
2024-01-01 Server started
```

This is genuinely useful when tailing a log in a tool that only loads a static snapshot. Instead of scrolling to the bottom every time, reverse the lines and read top-down chronologically. For very large logs, reversing the last N lines is faster than loading the entire file — use `tail -n 50 log.txt` then paste and reverse.

## Simple obfuscation for demos

Need to show "real" data in a screenshot without exposing actual values? Character reversal is a quick and dirty way to make text unreadable at a glance.

**Input:** `john.doe@company.com`
**Reversed:** `moc.ynapmoc@eod.nhoj`

Obviously this isn't encryption — anyone can reverse it back. But for screenshots, presentations, or sharing debugging output where the real values shouldn't be visible, it's faster than manually replacing every character with `x`.

## Reversing a code snippet for fun

Character reversing code produces surprisingly amusing output that still looks vaguely code-like.

**Input:**
```
function hello() {
  console.log("world");
}
```
**Reversed:**
```
}
;)dlrow"(gol.elosnoc  
{ )(olleh noitcnuf
```

Word reversal on the same snippet is more readable at a glance but equally useless as code — `} { )"world"(log.console hello() function` — which makes it a fun way to verify the different reversal modes are doing what you expect.
