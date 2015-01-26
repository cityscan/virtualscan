
// how do I shot fortune?
var fortunes = [
    'You will die painfully',
    'Pittsburgh has the most bridges of any city in the U.S.',
    'I just sneezed'
    ];

exports.getFortune = function() {
    var idx = Math.floor(Math.random() * fortunes.length);
    return fortunes[idx];
};
