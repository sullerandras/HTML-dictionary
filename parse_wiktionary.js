var lazy = require("lazy")
var fs = require("fs")

var n = 0
var g_line = ''

function Word(word, type, meaning, thai, transliteration, qualifier) {
	this.word = word
	this.type = type
	this.meaning = meaning
	this.translations = []
}
Word.prototype = {
	toFile: function() {
		var s = '{"word":"'+this.word+'", "type":"'+this.type+
			'", "meaning":"'+this.meaning+'", "translations":['
		for (var i in this.translations) {
			var t = this.translations[i]
			s += '{"word":"'+t.word+'", "tl":"'+t.transliteration+'"'
			if (t.qualifier) {
				s += ', "qualifier":"'+t.qualifier+'"'
			}
			s += '},'
		}
		s += ']},'
		return s
	},
	addTranslation: function(word, transliteration, qualifier) {
		this.translations.push({
			word: word,
			transliteration: transliteration,
			qualifier: qualifier
		})
		if (!word || word == 'undefined' || /[\[\]\{\}=]/.exec(transliteration) != null ||
				(/[a-zA-Z\[\]\{\}\|=]/.exec(word) != null && word != 'MP3' && word != 'Java' &&
					word != 'mansampalang' && word != 'vอี' && word != 'vะ' && word != 'PR')
				) {
			console.log('ERROR: line '+n+', invalid Translation: '+word+' ('+transliteration+')')
			console.log('line:', g_line)
		}
	},
}

// parse the given wiktionary dump and collects Thai translations
function parse(fileName) {
	var word = ''
	var mode = ''
	var trim = ''
	var type = ''
	var meaning = ''
	var outputStream = fs.createWriteStream('dict-th.js')
	outputStream.write('var th = [\n')

	new lazy(fs.createReadStream(fileName))
		.lines
		.map(function(line){
			n++
			line = (line || '').toString()
			g_line = line
			if (mode == '') {
				if (line.indexOf('<title>') >= 0) {
					mode = 'title'
					word = line.replace('<title>', '').replace('</title>', '').trim()
				}
			} else if (mode == 'title') {
				if (/==([^=]+)==$/.exec(line) != null) {
					mode = RegExp.$1 // it can be English, German, etc
					type = ''
					meaning = ''
				} else if (line.indexOf('</page>') >= 0) {
					mode = ''
				}
			} else if (mode == 'English') { // only interested in English contents
				if (/^===+([^=]+)===+$/.exec(line) != null) {
					var s = RegExp.$1
					if (['Alternative forms', 'Etymology', 'Etymology 1', 'Etymology 2', 'Pronunciation',
							'Translations', 'Derived terms', 'See also', 'Synonyms', 'Related terms',
							'Hyponyms', 'Hypernyms', 'Antonyms', 'Usage notes', 'Descendants',
							'Quotations', 'Coordinate terms'].indexOf(s) < 0) {
						type = RegExp.$1
						meaning = ''
					}
				} else if (line.indexOf('{{trans-top|') >= 0) {
					meaning = line.replace('{{trans-top|', '').replace('}}', '').trim()
				} else if (line.indexOf('* Thai:') >= 0) {
					var lin = line.replace('* Thai: ', '').trim()
					var translations = lin.replace('}} ({{', '}}, {{').replace('}},{{', '}}, {{').
						replace('{{f}} (formal) {{', '{{f}} (formal), {{').replace(/}} {{t/g, '}}, {{t').
						replace('),{{t', '), {{t').replace(') or {{Thai|', '), {{Thai|').replace('}} ~ {{', '}}, {{').
						replace('}} or {{', '}}, {{').
						split(/[\}\)\]] *[\,\;] +[\{\[]/)
					var w = new Word(word, type, meaning)
					for (var i in translations) {
						var item = translations[i]
						if (
								/^{+[^|]+\|th\|([^|]+)\|tr=([^|}]+)[})]+$/.exec(item) != null || //{{t+|th|ดี|tr=dee}}
								/^{+[^|]+\|th\|([^}|]+)}+$/.exec(item) != null || //{{t-|th|พาย}}
								/^{+Thai\|\[\[([^\]]+)\]\]\}\} +\(([^\)]+)\)?$/.exec(item) != null || //{{Thai|[[แมว]]}} (maew)
								/^{+[^|]+\|th\|([^|]+)\|sc=Thai}+$/.exec(item) != null || //{{t|th|ชั่วโมง|sc=Thai}}
								/^{+[^|]+\|th\|([^|]+)\|alt=[^|}]+\|tr=([^|}]+)}+$/.exec(item) != null || //{{t|th|ที่สุด|alt=..ที่สุด|tr=...têe-sùt}}
								/^{+[^|]+\|th\|([^|]+)\|[cmfn]\|tr=([^|}]+)}+$/.exec(item) != null || //{{t-|th|นักเขียน|m|tr=nak-khian}}
								/^{+[^|]+\|th\|([^|]+)\|[cmf]\|[cmf]\|tr=([^|}]+)}+$/.exec(item) != null || //{{t+|th|สวัสดี|m|f|tr=sawàtdee}}
								/^{+[^|]+\|th\|([^|]+)\|[cm]\|tr=([^|}]+)\|sc=[^|}]+}+$/.exec(item) != null || //{{t|th|ประเทศอุซเบกิสถาน|m|tr=bpràtêt ùsábaygìttăan|sc=Thai}}
								/^\[+([^\]]+)\]+ +\(([^\)]+)\)?$/.exec(item) != null || //[นาม]] (naam)
								/^\[+([^\]]+)\]+$/.exec(item) != null || //[[ประเทศกินี-บิสเซา]]
								/^{+[^|]+\|th\|([^}|]+)}} *\(([^)]+)\) \+ ''comp''$/.exec(item) != null || //{{t+|th|ยิ่ง}}(yîng) + ''comp''
								/^{+Thai\|\[\[([^\]]+)\]\]\}\} +\(([^\)]+)\) \(numeral: \{\{[^\}]+\}\}\)$/.exec(item) != null || //{{Thai|[[เจ็ด]]}} (jèt) (numeral: {{Thai|[[๗]]}})
								/^{+[^|]+\|th\|([^|]+)\|tr=([^|}]+)\}\} \(numeral: \{\{[^\}]+\}\}\)$/.exec(item) != null || //{{t+|th|สอง|tr=sááwng}} (numeral: {{t+|th|๒}})
								/^{+[^|]+\|th\|([^|]+)\|tr=([^|}]+)\}\} \([^\)]+\)$/.exec(item) != null || //{{t-|th|เปิด|tr=bpèrt}} (เปิดประเด็น)
								/^{+[^|]+\|th\|([^|]+)\}\} \(([^\)]+)\)?$/.exec(item) != null || //{{t+|th|เวลา}} (waylaa)
								/^{+[^|]+\|th\|([^|]+)\}\}\(([^\)]+)\) \(=show\)$/.exec(item) != null || //{t|th|โชว์}}(choh) (=show)
								/^{+Thai\|\[\[([^\]]+)\]\]\}\} +\(([^\)]+)\) +\{\{qualifier\|([^\}]+)\}+$/.exec(item) != null || //{{Thai|[[ดูดี]]}} (doo dee) {{qualifier|informal}}
								/^{+[^|]+\|th\|([^|]+)\|tr=([^|}]+)\|sc=[^|}]+}+$/.exec(item) != null || //{{t|th|หมา|tr=mǎa|sc=Thai}}
								/^{+[^|]+\|th\|([^|]+)\|sc=Thai\|tr=([^|}]+)}+$/.exec(item) != null || //{{t|th|ถึงจุดสุดยอด|sc=Thai|tr=těung jùt sùt yôt}
								/^{+[^|]+\|th\|([^|]+)\|tr=([^|}]+)\|sc=[^|}]+\}\} +\(([^\)]+)\)?$/.exec(item) != null || //{{t|th|ปู่|tr=poo|sc=Thai}} (paternal
								/^{+Thai\|\[\[([^\]]+)\]\]\}\} +\(([^\)]+)\), both often used loosely for non-relatives$/.exec(item) != null || //{Thai|[[น้อง]]}} (norng, younger), both often used loosely for non-relatives
								/^{+Thai\|\[\[([^\]]+)\]\]\}\} +\(([^\)]+)\) \{\{m\}$/.exec(item) != null || //{{Thai|[[สวัสดีครับ]]}} (sàwàtdee kráp) {{m}
								/^{+Thai\|\[\[([^\]]+)\]\]\}\} +\(([^\)]+)\) \{\{f\}\} \(formal$/.exec(item) != null || //{Thai|[[สวัสดีค่ะ]]}} (sàwàtdee kâ) {{f}} (formal
								/^{+Thai\|\[\[([^\]]+)\]\]\}\} +\(([^\)]+)\) \((informal)\)$/.exec(item) != null || //{Thai|[[ฮัลโหล]]}} (hanlǒh) (informal)
								/^{+Thai\|\[\[([^\]]+)\]\]\?\}\} +\(([^\)]+)\)?$/.exec(item) != null || //{{Thai|[[มีใครอยู่มั้ย]]?}} (mee krai yòo mái?)
								/^{+[^|]+\|th\|([^|]+)\|sc=Thai\}\} +\(([^\)]+)\)?$/.exec(item) != null || //{t-|th|สหาย|sc=Thai}} (sa hāy)
								/^{+[^|]+\|th\|([^|]+)\|sc=Thai\|xs=English\}\}$/.exec(item) != null || //{{t|th|การเคลื่อนไหว|sc=Thai|xs=English}}
								/^{+[^|]+\|th\|([^|]+)\|tr=([^|}]+)\}\}\!$/.exec(item) != null || //{{t-|th|ขี้โม้|tr=kêe móh}}!
								/^{+[^|]+\|th\|([^|]+)\|alt=[^|}]+\|tr=([^|}]+)\|sc=Thai}+$/.exec(item) != null || //{{t|th|วิทยา|alt=-วิทยา|tr=-wíttáyaa|sc=Thai}}
								/^{+[^|]+\|th\|([^|]+)\|alt=[^|}]+\|tr=([^|}]+)\}\} \(''[f]?[e]?male speaker''\)?$/.exec(item) != null || //{{t|th|ผมชื่อ|alt=ผมชื่อ...|tr=phõm chêu...}} (''male speaker''
								/^{+[^|]+\|th\|([^|]+)\|tr=([^|}]+)\|alt=[^|}]+\|sc=Thai}+$/.exec(item) != null || //{{t|th|กันเถอะ|tr=...gan tùh|alt=...กันเถอะ|sc=Thai}}
								/^{+[^|]+\|th\|([^|]+)\|sc=Latn}+$/.exec(item) != null || //{t-|th|MP3|sc=Latn}}
								/^{+[^|]+\|th\|([^|]+)\|\|tr=([^|}]+)[})]+$/.exec(item) != null || //{{t-|th|น้ำนม||tr=náam nom}}
								/^{+[^|]+\|th\|([^|]+)\|tr=([^|}]+)\}\} &lt;!-- [^&]+ --&gt;$/.exec(item) != null || //{{t|th|ตูนิส|tr=Too-Nis}} &lt;!-- please check this romanisation --&gt;
								/^{+[^|]+\|th\|([^|]+)\}\} &lt;!-- [^&]+--&gt;$/.exec(item) != null || //{{t|th|อณูพันธุศาสตร์}} &lt;!-- (??? ???? ra??)--&gt;
								/^{+[^|]+\|th\|([^|]+)\|tr=([^|}]+)\|xs=Thai\}\}$/.exec(item) != null || //{{t-|th|โวลต์|tr=wohn|xs=Thai}}
								/^{+[^|]+\|th\|([^|]+)\|tr=([^|}]+)\}\}\.\.\.$/.exec(item) != null || //{{t+|th|อย่า|tr=yàa}}...
								/^{+[^|]+\|th\|([^|]+)\|tr=Thai\|tr=([^|}]+)\}\}$/.exec(item) != null || //{{t|th|เทววิทยา|tr=Thai|tr=tâywawíttáyaa}}
								/^(มลายู|การป้องกัน\(ล่วงหน้า\))$/.exec(item) != null || //มลายู
								/^{+[^|]+\|th\|([^|]+)\|sc=Thai\|xs=Thai}+$/.exec(item) != null || //{{t|th|หอคอยบาเบล|sc=Thai|xs=Thai}}
								/^{+[^|]+\|th\|([^|]+)\|tr=([^|}]+)\|sc=Thai\|xs=Thai}+$/.exec(item) != null || //{{t-|th|หลัก|tr=làk|sc=Thai|xs=Thai}}
								/^{+[^|]+\|th\|([^|]+)\|[nf]\|sc=Thai}+$/.exec(item) != null || //{{t|th|คำผวน|n|sc=Thai}}
								/^{+[^|]+\|th\|([^|]+)\|xs=Thai}+$/.exec(item) != null || //{{t-|th|เห็ดหอม|xs=Thai}}
								/^{+[^|]+\|th\|([^|]+)\|tyr=([^|}]+)\|sc=Thai\}\}$/.exec(item) != null || //{{t|th|เยอรมันเชฟเฟิร์ด|tyr=yerráman chêffêrt|sc=Thai}}
								/^{+[^|]+\|th\|Thai\|([^|]+)\|tr=([^|}]+)\}\}$/.exec(item) != null || //{t+|th|Thai|ยาชุบชีวิต|tr=yaa chóop cheewít}}
								/^{+Thai\|\[\[([^\]]+)\]\]\}+$/.exec(item) != null || //{{Thai|[[ขมิ้น]]}}
								/^\[+([^\]]+)\]+ +\(([^\)]+)\) \([a-z ]+\)?$/.exec(item) != null || //[[ย่า]] (yaa) (paternal grandmother
								/^{+[^|]+\|th\|([^|]+)\|([^sxt|][^|}]+)[})]+$/.exec(item) != null || //{{t-|th|หัวใจ|hŭajai}
						false) {
							var thai = RegExp.$1
							var transliteration = RegExp.$2 || ''
							var qualifier = RegExp.$3
							w.addTranslation(thai, transliteration, qualifier)
						} else if (item != "{{not used|th}}" &&
								item.indexOf('{qualifier|') < 0 &&
								item != "''absent with adjectives''") {
							console.log('ERROR: line '+n+', unrecongnized translation:', item)
							console.log('line:', line)
						}
					}
					if (w.translations.length > 0) {
						outputStream.write(w.toFile()+'\n')
					}
				} else if (line.indexOf('</page>') >= 0) {
					mode = ''
				}
			} else { //unsupported mode
				if (line.indexOf('</page>') >= 0) {
					mode = ''
				}
			}
		})
		.filter(function(item){
			return item != undefined
		})
		.join(function(xs){
			outputStream.write(']\n')
		})
}

parse('./wiktionary-full.txt')
