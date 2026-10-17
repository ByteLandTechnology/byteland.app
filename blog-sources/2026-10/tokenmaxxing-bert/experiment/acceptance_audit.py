"""Offline acceptance audit, not an optimized-branch benchmark."""
import sys, json, hashlib, platform, argparse
from pathlib import Path
ROOT=Path(__file__).resolve().parent
parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument('--tokenizer', type=Path, default=ROOT/'bert-tokenizer.json')
parser.add_argument('--output-dir', type=Path, default=ROOT)
args=parser.parse_args()
args.output_dir.mkdir(parents=True, exist_ok=True)
import tokenizers
from tokenizers import Tokenizer
p=args.tokenizer
t=Tokenizer.from_file(str(p))
cases={
'english_ticket':'Please reset my password; the login link expired.',
'code_python':'def normalize(text: str) -> str:\n    return text.strip().lower()',
'code_json':'{"user_id": 123, "is_active": true, "retry": null}',
'log_line':'2026-10-17T00:00:00Z ERROR request_id=abc-123 status=503',
'french':'Le café est fermé. Où est la bibliothèque ?',
'german':'Straße, Größe, Überweisung: prüfen Sie die Angaben.',
'russian':'Не удаётся войти в учётную запись.',
'greek':'Δεν μπορώ να συνδεθώ στον λογαριασμό μου.',
'arabic':'لا أستطيع تسجيل الدخول إلى حسابي.',
'chinese':'登录失败，请重置密码。',
'japanese':'ログインできません。パスワードをリセットしてください。',
'korean':'로그인할 수 없습니다. 비밀번호를 재설정하세요.',
'emoji':'Hello 👩🏽\u200d💻 world',
'composed':'Café résumé naïve',
'decomposed':'Cafe\u0301 re\u0301sume\u0301 nai\u0308ve',
'dotted_i':'İSTANBUL',
'whitespace':'Hello\tworld\nnext\u00a0page\u2003end',
'controls':'a\x00b\ufffdc\u200bd',
'fullwidth':'ＡＢＣ １２３',
'compatibility':'① ﬁ ㎏',
'empty':'',
'one_ascii':'A',
'one_cjk':'中',
'leading_combining':'\u0301Cafe\u0301',
}
records=[];checks=[]
def check(name,ok):checks.append({'name':name,'passed':bool(ok)})
for name,s in cases.items():
 e=t.encode(s);n=t.normalizer.normalize_str(s)
 check(name+':normalizer_idempotent_hypothesis',t.normalizer.normalize_str(n)==n)
 check(name+':normalizing_input_preserves_ids',t.encode(n).ids==e.ids)
 check(name+':offset_bounds',all(0<=a<=b<=len(s) for a,b in e.offsets))
 check(name+':special_offsets',all(off==(0,0) for off,m in zip(e.offsets,e.special_tokens_mask) if m))
 records.append({'case':name,'input':s,'normalized':n,'ids':e.ids,'tokens':e.tokens,'offsets':e.offsets,'special_tokens_mask':e.special_tokens_mask,'original_slices':[s[a:b] for a,b in e.offsets]})
for (name,s),e in zip(cases.items(),t.encode_batch(list(cases.values()))):
 one=t.encode(s)
 check(name+':batch_matches_single',e.ids==one.ids and e.offsets==one.offsets)
for a,b in [('Café','Cafe\u0301'),('HELLO WORLD','hello world'),('hello\tworld','hello world')]:
 check('equivalent:'+repr(a),t.encode(a).ids==t.encode(b).ids)
check('fullwidth_not_NFKC',t.normalizer.normalize_str('ＡＢＣ')=='ａｂｃ')
check('circled_digit_not_NFKC',t.normalizer.normalize_str('①')=='①')
check('decomposed_accent_offset_excludes_removed_mark',t.encode('Cafe\u0301').offsets[1]==(0,4))
check('removed_control_span_can_include_original_control',t.encode('a\x00b').offsets[1]==(0,3))
check('emoji_zwj_removed_by_cleaning','\u200d' not in t.normalizer.normalize_str(cases['emoji']))
result={'scope':'Baseline acceptance audit only; optimized PR not executed; no speedup measured.', 'tokenizers_version':tokenizers.__version__,'python':platform.python_version(),'tokenizer_source':'https://huggingface.co/bert-base-uncased/resolve/main/tokenizer.json','tokenizer_sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'vocabulary_size':t.get_vocab_size(),'cases':len(cases),'checks':len(checks),'passed':sum(x['passed'] for x in checks),'failures':[x for x in checks if not x['passed']],'records':records,'check_results':checks}
(args.output_dir/'acceptance-results.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({k:v for k,v in result.items() if k not in ['records','check_results']},ensure_ascii=False,indent=2))
# Failed hypotheses are retained as findings, not hidden or discarded.
