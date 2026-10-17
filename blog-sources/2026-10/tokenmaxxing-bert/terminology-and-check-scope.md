# Language review: ASD-STE100 Issue 9 target

This is a partial editorial review, not a claim of ASD-STE100 Issue 9 compliance. An authorized full Issue 9 dictionary and complete rule-by-rule checker were unavailable. No protected dictionary text is reproduced.

Completed checks: clear actors and verbs; short explanatory sentences where practical; specific distinction between observed results, vendor performance claims, and engineering advice; consistent technical names; limited noun clusters; explicit version identifiers; concrete conclusion. Sentence-length heuristics are only supporting checks. Approved word meaning, part of speech, and all technical-name/technical-verb conditions were not fully validated.

| Term | Meaning in this article | Category and reason retained |
| --- | --- | --- |
| BERT | Named model family | Technical product/model name |
| tokenizers | Exact library name | Software identifier |
| tokenizer | Software that converts text to model inputs | Technical noun, needed to name the subject |
| token ID | Integer identifying a vocabulary entry | Technical noun, distinct from token string |
| offset | Start/end position in original input | Technical noun, needed for the observed behavior |
| half-open range | Includes start, excludes end | Technical name for interval convention |
| normalization | Text transformation before token selection | Technical noun; distinguish BERT steps from standard Unicode forms |
| Unicode | Character encoding standard name | Proper technical name |
| ASCII | Named character repertoire | Standard identifier |
| CJK | Chinese/Japanese/Korean character grouping | Defined abbreviation; examples concern Chinese character padding |
| NFKC | Compatibility normalization form with composition | Exact Unicode form identifier |
| combining mark | Code point that modifies a preceding character | Technical noun required for source-offset example |
| SIMD / vector instruction | Instruction processing multiple data elements | Technical name; article uses plain-language vector instructions |
| allocation | Reserving memory for an output | Technical computing noun |
| vocabulary | Mapping between token strings and IDs | Technical noun tied to the supplied tokenizer |
| prerelease / rc0 | Software before stable release / release-candidate label | Precise version-status terms |
| draft pull request | Proposed repository change still marked draft | Exact development-state concept |
| idempotence | Repeating an operation does not change its result further | Mathematical technical name, explained by example |
| rollback | Returning to the previous dependency version | Technical operational noun |

Retention here is an editorial justification, not a claim that each term satisfies every STE exemption condition.
