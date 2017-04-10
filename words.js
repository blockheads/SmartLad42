
var words = ["Blood Money","Benji","Funny Money","Yard ","Pots of Money",
             "Brass","Scrilla","Scrappa","Dibs","Handbag","Measures",
             "Bag of Sand","ROBLOX","911 was an inside job","smoke weed",
             "Matt is CIA","the Third Temple is coming","Flag","Handful",
             "Mill","Sheckles","Ton","Stack","Brick","Dough","Bread",
             "Good Cash","C-Note","Feddie","Cod","Course Note","High Rollin",
             "Yayo","Rack","kilo","mula","Fuck-Fuck","nigga","big weed",
             "Big Watch","Big Booty","Shaboobalaboopy","Stiplificate",
             "Apologin","Bling Bling","Mamajahambo","dinosaurs",
             "movie movie movie","Captian Alexe","Herb","Buster",
             "Flossy","Thizz","Bling Bling","Frankenstein Controls","CIA radio",
             "Dianna Cowern", "Flava Flav","What","Time","You know what time it is",
             "Clock","Vanta Black","Red Oyster","Hottie","New York", "Hoopz",
             "Goldie","Smiley","Cutie","Big Rick","died","smoked","ran","talked",
             "is","and","who","the","where","what","so","then","killed himself",
             "talks","walks","eats","fart","a","an","who","@@@","yup","woah",
             "there","that","was","is","today","tomorrow","hello","someone",
             "watches","I","am","God","fear","me","I","will","murder","everyone",
             "Tommorow","at","seven","o'clock","don't","come","to","school",
             "The","man","is","insane","he","thinks","he","is","me","but","he",
             "doesn't","look","like","me","or","talk","like","me","he","is",
             "a","duckman","rururururu","clown","heckin'","ratboy genius","mime",
             "Zain","Giga Nigga"];

var scotsman = ["Mr.","pajama-wearin'","basket-face","slipper-wieldin'",
                "clype-dreep-bachle","gether-uping-blate-maw","bleathering gomeril",
                "jessie","oaf-lookin'","stoner","nyaff"," plookie","shan","milk drinkin'",
                "soy-faced","shilpit","mim-moothed","snivelin'","worm-eyed",
                "hotten-blaugh","vile","stoochie","cally-breek-tattie","bug fightin'",
                "jellyfish jumpin'","back-fur lovin'","needle pullin'","ladybud lovin'",
                "time slot losin'","april foolin'","time wastin'","frog-postin'","dog-lovin'",
                "spear-chuckin'","acid-trippin'","no-good","pansy","lily-livered",
                "yellow-bellied","weak-stomached","cowerin'","bot-codin'","matt-hatin'",
                "dnd-cancellin'","time-knowin'","matt-bein'","glover-playin'","scream typin'",
                "programmin'","calc-failin'","ninny","project-doin'","roblox-lovin'","facebook-postin'",
                "base-court","bat-fowlin'","beef-witted","beetle-headed","boil-brained","clapper-clawed",
                "clay-brained","common-kissin'","crook-pated","dismal-dreaming","dizzy-eyed",
                "doghearted","dread-bolted","earth-vexin'","elf-skinned","fat-kidneyed","fen-sucked",
                "flap-mouthed","fly-bitten","folly-fallen","fool-born","full-gorged","guts-gripin'",
                "half-faced","hasty-witted","hedge-born","hell-hated","idle-headed","ill-breedin'",
                "ill-nurtured","knotty-pated","milk-livered","motley-minded","onion-eyed",
                "plume-plucked","pox-marked","reeling-ripe","rough-hewn","rude-growin'","rump-fed",
                "shard-borne","sheep-bitin'","spur-gaited","swag-bellied","tardy-gaited",
                "tickle-brained","toad-spotted","unchin-snouted","weatherbitten"];

var scotsmanNouns = ["apple-john","baggage","barnacle","bladder","boar-pig","bugbear","bum-bailey",
                     "canker-blossom","clack-dish","clotpole","coxcomb","codpiece","death-token",
                     "dewberry","flap-dragon","flax-wench","flirt-gill","foot-licker","fustilarian",
                     "giglet","gudgeon","haggard","harpy","hedge-pig","horn-beast","hugger-mugger",
                     "hoithead","lewdster","lout","maggot-pie","malt-worm","mammet","measle","minnow",
                     "miscreant","moldwarp","mumble-news","nut-hook","pigeon-egg","pignut","puttock",
                     "pumpion","ratsbane","scut","skainsmate","strumpet","varlot","vassal","whey-face","wagtail"];


//generates a string of random words
function randomWords(data, size){
    var returnstring = '';
    for(var i=0;i<size-1;i++){
        returnstring+= data[Math.floor( Math.random()*data.length)] + " ";
    }
    returnstring+= data[Math.floor( Math.random()*data.length)];
    return returnstring;
}

module.exports = 
{
    //generates random words from randomWords
    godSays : function (message){
        message.channel.sendMessage("```css\n" + randomWords(words, Math.floor( Math.random()*20)) + "```",{tts:true});
    },
    
    //generates random words from scotsman & scotsmanNouns
    scotsman : function (message){
        message.channel.sendMessage("**" + (randomWords(scotsman, Math.floor( Math.random()*20)) + " " + randomWords(scotsmanNouns, 1)).toUpperCase() + "**",{tts:true});
    }
}
