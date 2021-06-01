// author Aung Phyo Khaing + Zin Kyaw Kyaw
//version 1.0.0
module.exports =  (str) => 
{
    var zgRegex = 'ေျ' // e+medial ra
    // beginning e or medial ra
    zgRegex += '|^ေ|^ျ'
    // independent vowel, dependent vowel, tone , medial ra wa ha (no ya
    // because of 103a+103b is valid in unicode) , digit ,
    // symbol + medial ra
    zgRegex += '|[ဢ-ူဲ-္ျ-ွ၀-၏]ျ'
    // end with asat
    zgRegex += '|္$'
    // medial ha + medial wa
    zgRegex += '|ွြ'
    // medial ra + medial wa
    zgRegex += '|ျြ'
    // consonant + asat + ya ra wa ha independent vowel e dot below
    // visarga asat medial ra digit symbol
    zgRegex += '|[က-အ]္[ယရဝဟဢ-ဪေ့-္ျ၀-၏]'
    // II+I II ae
    zgRegex += '|ီ[ိှဲ]'
    // ae + I II
    zgRegex += '|ဲ[ိီ]'
    // I II , II I, I I, II II
    //+ "|[ိီ][ိီ]"
    // U UU + U UU
    //+ "|[ုူ][ုူ]" [ FIXED!! It is not so valuable zawgyi pattern ]
    // tall aa short aa
    //+ "|[ါာ][ါာ]" [ FIXED!! It is not so valuable zawgyi pattern ]
    // shan digit + vowel
    zgRegex += '|[႐-႙][ါ-ူဲ့ြ-ှ]'
    // consonant + medial ya + dependent vowel tone asat
    zgRegex += '|[က-ဪ]်[ာ-ီဲ-ံ]'
    // independent vowel dependent vowel tone digit + e [ FIXED !!! - not include medial ]
    zgRegex += '|[ဣ-ူဲ-္၀-၏]ေ'
    // other shapes of medial ra + consonant not in Shan consonant
    zgRegex += '|[ၾ-ႄ][ခဃစ-ဏဒ-နဖ-ဘဟ]'
    // u + asat
    zgRegex += '|ဥ္'
    // eain-dray
    zgRegex += '|[ႁႃ]ႏ'
    // short na + stack characters
    zgRegex += '|ႏ[ၠ-ႍ]'
    // I II ae dow bolow above + asat typing error
    zgRegex += '|[ိ-ူဲံ့]္'
    // aa + asat awww
    zgRegex += '|ာ္'
      
    // ya + medial wa
    zgRegex += '|ရြ'
    // non digit + zero + ိ (i vowel) [FIXED!!! rules tested zero + i vowel in numeric usage]
    zgRegex += '|[^၀-၉]၀ိ'
    // e + zero + vowel
    zgRegex += '|ေ?၀[ါၚီ-ူဲံ-း]'
    // e + seven + vowel
    zgRegex += '|ေ?၇[ာ-ူဲံ-း]'
    // cons + asat + cons + virama
    //+ "|[က-အ]်[က-အ]္" [ FIXED!!! REMOVED!!! conflict with Mon's Medial ]
    // U | UU | AI + (zawgyi) dot below
    zgRegex += '|[ုူဲ]႔'
    // virama + (zawgyi) medial ra
    zgRegex += '|္[ၾ-ႄ]';
    
    
    var regex  = RegExp(zgRegex);
    return regex.test(str)
}
