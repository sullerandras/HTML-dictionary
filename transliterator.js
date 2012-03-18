var logs = ''
function log(s) {
	if (logs) {
		logs += '\n'
	}
	logs += s
}
function Consonant(thai, initialSound, finalSound) {
	this.thai = thai
	this.initialSound = initialSound
	this.finalSound = finalSound
}
Consonant.prototype.getConsonantSound = function(initial) {
	if (this.finalSound == undefined && !initial) console.log('Attempt to read non-initial sound for initial-only consonant! '+this.toString())
	if (this.finalSound == undefined) return this.initialSound
	if (initial) return this.initialSound
	return this.finalSound
}
Consonant.prototype.toString = function() {
	return 'Consonant('+this.thai+', '+this.initialSound+(this.finalSound ? ', '+this.finalSound : '')+')'
}
Consonant.prototype.getClassName = function(){
	return 'Consonant'
}
var consonants = {
	ก: new Consonant('ก', 'k', 'k'),
	ข: new Consonant('ข', 'kh', 'k'),
	ค: new Consonant('ค', 'kh', 'k'),
	ฆ: new Consonant('ฆ', 'kh', 'k'),
	ง: new Consonant('ง', 'ng', 'ng'),
	จ: new Consonant('จ', 'ch', 't'),
	ฉ: new Consonant('ฉ', 'ch'),
	ช: new Consonant('ช', 'cs', 't'),
	ซ: new Consonant('ซ', 'sz', 't'),
	ฌ: new Consonant('ฌ' ,'ch'),
	ญ: new Consonant('ญ', 'y', 'n'),
	ฎ: new Consonant('ฎ' ,'d', 't'),
	ฏ: new Consonant('ฏ' ,'t', 't'),
	ฐ: new Consonant('ฐ' ,'th', 't'),
	ฑ: new Consonant('ฑ' ,'th', 't'),
	ฒ: new Consonant('ฒ', 'th', 't'),
	ณ: new Consonant('ณ', 'n', 'n'),
	ด: new Consonant('ด' ,'d', 't'),
	ต: new Consonant('ต', 'dt', 't'),
	ถ: new Consonant('ถ', 'th', 't'),
	ท: new Consonant('ท', 'th', 't'),
	ธ: new Consonant('ธ', 'th', 't'),
	น: new Consonant('น', 'n', 'n'),
	บ: new Consonant('บ', 'b', 'p'),
	ป: new Consonant('ป', 'bp', 'p'),
	ผ: new Consonant('ผ', 'ph'),
	ฝ: new Consonant('ฝ', 'f'),
	พ: new Consonant('พ', 'ph', 'p'),
	ฟ: new Consonant('ฟ', 'f', 'p'),
	ภ: new Consonant('ภ', 'ph', 'p'),
	ม: new Consonant('ม', 'm', 'm'),
	ย: new Consonant('ย', 'y', 'y'),
	ร: new Consonant('ร', 'r', 'n'),
	ล: new Consonant('ล', 'l', 'n'),
	ว: new Consonant('ว', 'w', 'w'),
	ศ: new Consonant('ศ', 'sz', 't'),
	ษ: new Consonant('ษ', 'sz', 't'),
	ส: new Consonant('ส', 'sz', 't'),
	ห: new Consonant('ห', 'h'),
	ฬ: new Consonant('ฬ', 'l', 'n'),
	อ: new Consonant('อ', ''),
	ฮ: new Consonant('ฮ', 'h'),
}
var allowed_consonant_groups = {
	'กษ': true,
	'คว': true,
	'ปล': true,
	'ดอ': true
}
function Vowel(thai, translation, consonant_first, is_partial) {
	this.thai = thai
	this.translation = translation
	this.consonant_first = consonant_first ? true : false
	this.is_partial = is_partial ? true : false
}
Vowel.prototype.toString = function() {
	return 'Vowel(\''+this.thai+'\', '+this.translation+
		(this.consonant_first || this.is_partial ? ', '+this.consonant_first : '')+
		(this.is_partial ? ', true' : '')+')'
}
Vowel.prototype.getClassName = function(){
	return 'Vowel'
}
var vowels = {
	// Simple vowels column 1
	'ะ': new Vowel('ะ', 'á'),
	'ั': new Vowel('ั', 'á', undefined, true),
	'ิ': new Vowel('ิ', 'i', undefined, true),
	'ึ': new Vowel('ึ', 'ü'),
	'ุ': new Vowel('ุ', 'u', undefined, true),
	'เ-ะ': new Vowel('เ-ะ', 'e', true),
	'เ-็': new Vowel('เ-็', 'e', true, true),
	'แ-ะ': new Vowel('แ-ะ', 'e', true),
	'แ-็': new Vowel('แ-็', 'e', true),
	'โ-ะ': new Vowel('โ-ะ', 'ó', true),
	'เ-าะ': new Vowel('เ-าะ', 'áó', true),
	'็อ': new Vowel('็อ', 'o', undefined, true),
	'เ-อะ': new Vowel('เ-อะ', 'ö', true),

	// Simple vowels column 2
	'า': new Vowel('า', 'áá', undefined, true),
	'ี': new Vowel('ี', 'í'),
	'ือ': new Vowel('ือ', 'ű'),
	'ู': new Vowel('ู', 'ú'),
	'เ': new Vowel('เ', 'é', true, true),
	'แ': new Vowel('แ', 'e', true, true),
	'โ': new Vowel('โ', 'ó', true, true),
	// 'อ': new Vowel('อ', 'ó'),
	'็': new Vowel('็', 'ó', undefined, true),
	'เ-อ': new Vowel('เ-อ', 'ö', true, true),
	'เ-ิ': new Vowel('เ-ิ', 'ö', true),
	
	// Diphthongs
	'เ-ียะ': new Vowel('เ-ียะ', 'iö', true),
	'เ-ือะ': new Vowel('เ-ือะ', 'uö', true),
	'ัวะ': new Vowel('ัวะ', 'úö'),
	'เ-ีย': new Vowel('เ-ีย', 'ía', true, true),
	'เ-ื': new Vowel('เ-ือ', 'XX', true, true),
	'เ-ือ': new Vowel('เ-ือ', 'uö', true, true),
	'ัว': new Vowel('ัว', 'úö', undefined, true),

	// Phonetic diphthongs column 1
	'ิว': new Vowel('ิว', 'iú'),
	'เ-็ว': new Vowel('เ-็ว', 'éú', true),
	'เ-า': new Vowel('เ-า', 'áó', true, true),
	'ัย': new Vowel('ัย', 'ái'),
	'ใ': new Vowel('ใ', 'ái', true),
	'ไ': new Vowel('ไ', 'ái', true),
	'็อย': new Vowel('็อย', 'oi'),
	'ุย': new Vowel('ุย', 'ui'),

	// Phonetic diphthongs column 1
	'เ-ว': new Vowel('เ-ว', 'éó', true),
	'แ-ว': new Vowel('แ-ว', 'eó', true),
	'าว': new Vowel('าว', 'áó'),
	'เ-ียว': new Vowel('เ-ียว', 'ió', true),
	'าย': new Vowel('าย', 'ái'),
	'อย': new Vowel('อย', 'oi'),
	'โ-ย': new Vowel('โ-ย', 'oi', true),
	'เ-ย': new Vowel('เ-ย', 'öi', true),
	'วย': new Vowel('วย', 'úi'),
	'เ-ือย': new Vowel('เ-ือย', 'úi', true),

	// Extra vowels
	'ำ': new Vowel('ำ', 'ám'), //there is a small circle before the า, but it is not visible in sublime
	//'ใ': new Vowel('ใ', 'ái', true),
	//'ไ': new Vowel('ไ', 'ái', true),
	//'เ-ว': new Vowel('เ-ว', 'áó'),
	'ฤ': new Vowel('ฤ', 'ú'),
	'ฦ': new Vowel('ฦ', 'ú'),

	'เ-ี': new Vowel('เ-ี', undefined, true, true),
}
for (var i1 in vowels) {
	var v1 = vowels[i1]
	if (v1.thai.indexOf('-') >= 0 && !v1.consonant_first) {
		console.log(v1.toString()+' should have consonant_first == true')
	}
	for (var i2 in vowels) {
		var v2 = vowels[i2]
		if (i1 != i2) {
			if (v1.thai.substr(0, v2.thai.length) == v2.thai &&
					!v2.is_partial) {
				console.log(v2.toString()+' is a prefix of '+v1)
			}
		}
	}
}
var tones = {
	'่': '(low)',
	'้': '(falling)',
	'๊': '(high)',
	'๋': '(rising)',
	'์': 'indicates silent letter',
}
function Syllable(sentence, start, end) {
	this.chars = []
	for(var i = start; i < end; i++) {
		this.chars.push(sentence[i])
	}
}
Syllable.prototype.isOnlyOneConsonant = function() {
	var ch = this.chars[0]
	return (this.chars.length == 1) && (typeof ch == 'object' && ch.getClassName() == 'Consonant')
}
Syllable.prototype.mergeWith = function(syllable) {
	for(var i in syllable.chars) {
		this.chars.push(syllable.chars[i])
	}
}
Syllable.prototype.toString = function() {
	var s = ''
	this.chars.forEach(function(ch){
		if (s) {
			s += ', '
		}
		s += ch.toString()
	})
	return 'Syllable('+s+')'
}
Syllable.prototype.transliterate = function() {
	var that = this
	var str = ''
	this.chars.forEach(function(ch, index){
		if (typeof ch == 'object' && ch.getClassName() == 'Consonant') {
			var initial = (index == 0)
			//look for open and closed syllables
			if (index > 0) {
				var prev = that.chars[index - 1]
				if (typeof prev == 'object' && prev.getClassName() == 'Consonant') {
					if (allowed_consonant_groups[prev.thai + ch.thai]) {
						initial = true
					} else {
						if (index == that.chars.length - 1) {
							str += 'o' //closed syllable
						} else {
							str += 'á' //open syllable
						}
						initial = true //the implicit vowel closed the syllable
						if (index == that.chars.length - 1) {
							initial = false //if this is the last char in the syllable, it is a closing consonant
						}
					}
				}
			}
			str += ch.getConsonantSound(initial)
			if (that.chars.length == 1) {
				str += 'o' //special case: one consonant alone is a closed syllable
			}
		} else if (typeof ch == 'string') { //unrecognized character
			str += ch
		} else {
			str += ch.translation
		}
	})
	return str
}
function Thai(){
}
Thai.prototype.transliterate = function(text) {
	var sentences = this.preprocess(text)
	var chars = ''
	sentences.forEach(function(sentence){
		//find syllables to determine consonant sounds
		var syllables = []
		var last_syllable_start = 0
		sentence.forEach(function(ch, index){
			log(index + ' ' + ch.toString())
			if (typeof ch == 'object' && ch.getClassName() == 'Vowel' && index > 0) {
				var prev = sentence[index - 1]
				if (typeof prev == 'object' && prev.getClassName() == 'Consonant') {
					var sindex = index - 1
				} else {
					var sindex = index
				}
				syllables.push(new Syllable(sentence, last_syllable_start, sindex))
				last_syllable_start = sindex
			}
		})
		syllables.push(new Syllable(sentence, last_syllable_start, sentence.length))

		//merge syllables
		for (var i = 0; i < syllables.length - 1; i++) {
			if (syllables[i].isOnlyOneConsonant()) {
				syllables[i].mergeWith(syllables[i + 1])
				syllables.splice(i + 1, 1)
				i--
			}
		}

		var str = ''
		syllables.forEach(function(syllable){
			log(syllable.toString())
			if (str) str += ' '
			str += syllable.transliterate()
		})

		if (chars) chars += ' '
		chars += str
	})
	return chars
}
Thai.prototype.preprocess = function(text) {
	var res = []
	var arr = []
	var last_vowel = null
	var unprocessed_symbols = ''
	var last_consonant = null
	for (var i = 0; i < text.length; i++) {
		var ch = text.charAt(i)
		if (unprocessed_symbols && vowels[unprocessed_symbols + ch]) {
			if (!vowels[unprocessed_symbols + ch].is_partial) {
				var v = vowels[unprocessed_symbols + ch]
				if (last_consonant) {
					arr.push(last_consonant)
					last_consonant = null
				}
				arr.push(v)
				last_vowel = null
				unprocessed_symbols = ''
			} else {
				unprocessed_symbols += ch
				last_vowel = vowels[unprocessed_symbols]
			}
		} else if (consonants[ch]) {
			var c = consonants[ch]
			// if last_vowel.is_partial than store this consonant as well
			// if there was a stored consonant already, than write the stored consonant,
			// the vowel and this consonant
			if (last_vowel && !last_vowel.is_partial && last_vowel.consonant_first) {
				// write consonant first
				arr.push(c)
				arr.push(last_vowel)
				last_vowel = null
				unprocessed_symbols = ''
			} else if (last_vowel && last_vowel.is_partial && !last_vowel.consonant_first) {
				// consonant broke the vowel => write the vowel and the consonant
				arr.push(last_vowel)
				arr.push(c)
				last_vowel = null
				unprocessed_symbols = ''
			} else if (last_vowel && last_vowel.is_partial) {
				if (last_consonant) {
					if (last_vowel.consonant_first) {
						arr.push(last_consonant)
						last_consonant = null
					}
					arr.push(last_vowel)
					if (last_consonant) {
						arr.push(last_consonant)
					}
					arr.push(c)
					last_consonant = null
					last_vowel = null
					unprocessed_symbols = ''
				} else {
					last_consonant = c
					unprocessed_symbols += '-'
				}
			} else {
				arr.push(c)
			}
		} else if (tones[ch]) {
//			s += tones[ch]
		} else if (last_vowel) {
			if (last_consonant) {
				arr.push(last_vowel)
				arr.push(last_consonant)
			} else {
				arr.push(last_vowel)
			}
			last_vowel = null
			last_consonant = null
			unprocessed_symbols = ''
			i-- //process the current character again
		} else if (vowels[ch]) {
			var v = vowels[ch]
			if (v.is_partial || v.consonant_first) {
				last_vowel = v
				unprocessed_symbols = ch
				if (last_consonant) console.log('last_consonant should be null, but it is ' + last_consonant)
			} else {
				arr.push(v)
				if (last_vowel) console.log('last_vowel should be empty: '+last_vowel+', vowel: '+ch+
						', unprocessed_symbols: '+unprocessed_symbols)
			}
		} else if (ch == ' ') {
			if (arr.length) res.push(arr)
			arr = []
		} else {
			if (last_vowel && last_vowel.translation) {
				arr.push(last_vowel)
			}
			arr.push(ch)
			last_vowel = null
			unprocessed_symbols = ''
		}
	}
	if (unprocessed_symbols) {
		if (last_vowel.translation) {
			if (last_consonant && last_vowel.consonant_first) {
				arr.push(last_consonant)
				last_consonant = null
			}
			arr.push(last_vowel)
			if (last_consonant) {
				arr.push(last_consonant)
				last_consonant = null
			}
		} else {
			console.log('unprocessed_symbols left: '+unprocessed_symbols,
					'last_vowel: '+last_vowel)
		}
	}
	if (last_consonant) console.log('last_consonant left: ' + last_consonant)
	if (arr.length) res.push(arr)
	return res
}

var tests = [
	['ก ไก่', 'ko kái(low)'],
	['ข ไข่', 'kho khái(low)'],
	['ค ควาย', 'kho khwái'],
	['ฆ ระฆัง', 'kho rá kháng'],
	['ง งู', 'ngo ngú'],
	['จ จาน', 'cho cháán'],
	['ฉ ฉิ่ง', 'cho chi(low)ng'],
	['ช ช้าง', 'cso cs(falling)ááng'],
	['ซ โซ่', 'szo szó(low)'],
	['ฌ เฌอ', 'cho chö'],
	['ญ หญิง', 'yo ying'],
	['ฎ ชฎา', 'do csádáá'],
	['ฏ ปฏัก', 'to bpáták'],
	['ฐ ฐาน', 'tho tháán'],
	['ฑ มณโฑ', 'tho mon thó'],
	['ฒ ผู้เฒ่า', 'tho phú(falling) th(low)áó'],
	['ณ เณร', 'no nén'],
	['ด เด็ก', 'do dek'],
	['ต เต่า', 'dto dtáó'],
	['ถ ถุง', 'tho thung'],
	['ท ทหาร', 'tho tháháán'],
	['ธ ธง', 'tho thong'],
	['น หนู', 'no nu'],
	['บ ใบไม้', 'bo bái mái'],
	['ป ปลา', 'bpo bpláá'],
	['ผ ผึ้ง', 'pho phüng'],
	['ฝ ฝา', 'fo fáá'],
	['พ พาน', 'pho pháán'],
	['ฟ ฟัน', 'fo fán'],
	['ภ สำเภา', 'pho szám pháó'],
	['ม ม้า', 'mo máá'],
	['ย ยักษ์', 'yo yák'],
	['ร เรือ', 'ro ruö'],
/*
	['เณรเคาะประตูได้ยินเสียง',
		'naehnM khawH bpraL dtuuM daiF yinM siiangR'],
	// ['เณรเคาะประตูได้ยินเสียง "เชิญ" เลื่อนประตูออก เห็นหลวงพ่อกำลังนั่งจิบชาอ่านหนังสือพิมพ์',
	// 	'naehnM khawH bpraL dtuuM daiF yinM siiangR cheernM leuuanF bpraL dtuuM aawkL henR luaangR phaawF gamM langM nangF jipL chaaM aanL nangR seuuR phimM'],
	['หน', 'hon'],
	['หนม', 'nom'],
	['หงส์หยก', 'hohngR yohkL'],
	['หงส์แดง', 'hohngR daaengM'],
	['ลำลูกกา', 'lám lúk káá'],
	['วิหารแดง สระบุรี', 'wi háán deng szárá bu rí'],
	['นายอันเดรส ซูลเลอร์', ''],
	['นางสาวสุพัชรินทร์ อันทะไชย', ''],
	['พยัญชนะ', 'pháyán csáná'],
	['สระ', 'szárá'],
	['ตัวเลขไทย', 'dtúö lék tháiy'],
	['ฆ ระฆัง', 'kho rá kháng'],
	['ยาดี', 'yáá dí'],
	['อักษรไทย', 'ákszon tháiy'],
	['ฟางข้าว', 'fááng kháó'],
*/
]

var failedCount = 0
tests.forEach(function(test){
	logs = ''
	var text = test[0]
	var expected = test[1]
	//remove tones from expected string
	expected = expected.replace(/\([^)]+\)/g, '')
	var res = new Thai().transliterate(text)
	if (expected !== res) {
		console.log()
		console.log(logs)
		console.log()
		failedCount++
	}
	console.log(text+' => '+res+' '+(expected == res ? '' : 'FAILED, expected '+expected))
})
console.log()
console.log('Total: '+tests.length+', failed: '+failedCount)
