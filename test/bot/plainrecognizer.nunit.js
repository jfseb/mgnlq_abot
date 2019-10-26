

var root =  '../../js';
//var debuglog = require('debug')('plainRecoginizer.nunit');

const recognizer = require(root + '/bot/plainrecognizer.js');

exports.testParseRuleInt = function (test) {
  const res =
    recognizer.parseRule('what is <category> in <A1>');
  //  test.deepEqual(res.regexp, new RegExp('^what is (.*) in (.*)$', 'i'), 're 1' );
  //  test.deepEqual(res.regexp.toString(), (new RegExp('^what is (.*) in (.*)$', 'i')).toString(), 're 2' );

  test.deepEqual(res, {
    type: 1,
    regexp: new RegExp('^what is (.*) in (.*)$', 'i'),
    argsMap: {
      'category': 1,
      'A1': 2
    }
  }, 'parsed ok');
  test.done();
};



exports.testParseRuleGreedy = function (test) {
  const res =
    recognizer.parseRule('what ((is)|(was)) a <category>? in <A1> and');
  test.deepEqual(res, {
    type: 1,
    regexp: /^what ((is)|(was)) a (.*?) in (.*) and$/i,
    argsMap: {
      'category': 4,
      'A1': 5
    }
  }, 'parsed ok');
  test.done();
};

exports.testParseRuleIntParen = function (test) {
  const res =
    recognizer.parseRule('what (is)|(was) a <category> in <A1> and');
  test.deepEqual(res, {
    type: 1,
    regexp: /^what (is)|(was) a (.*) in (.*) and$/i,
    argsMap: {
      'category': 3,
      'A1': 4
    }
  }, 'parsed ok');
  test.done();
};

exports.testParseRuleIntParenWeird = function (test) {
  const res =
    recognizer.parseRule('what (is)|(was) (a <category>) in <A1> and');
  test.deepEqual(res, {
    type: 1,
    regexp: /^what (is)|(was) (a (.*)) in (.*) and$/i,
    argsMap: {
      'category': 4,
      'A1': 5
    }
  }, 'parsed ok');
  test.done();
};

exports.testParseRuleIntArray = function (test) {
  const res =
    recognizer.parseRule([/^what (is)|(was) (a (.*)) in (.*) and$/i, { 'category': 4, 'A1': 5 }]);
  test.deepEqual(res, {
    type: 1,
    regexp: /^what (is)|(was) (a (.*)) in (.*) and$/i,
    argsMap: {
      'category': 4,
      'A1': 5
    }
  }, 'parsed ok');
  test.done();
};

exports.testRecognize = function (test) {
  const res =
    recognizer.parseRule('what ((is)|(was)) (a <category>) in <A1> and');
  test.deepEqual(res, {
    type: 1,
    regexp: /^what ((is)|(was)) (a (.*)) in (.*) and$/i,
    argsMap: {
      'category': 5,
      'A1': 6
    }
  }, 'parsed ok');
  var match = recognizer.recognizeText('What is a ABC AND K in CDEF and', [res]);
  test.deepEqual(match, {

    entities: [{
      type: 'category',
      'entity': 'ABC AND K',
      startIndex: 10,
      endIndex: 19
    },
    {
      type: 'A1',
      entity: 'CDEF',
      startIndex: 23,
      endIndex: 27
    }
    ],
    score: 0.9
  }, 'matche ok');
  test.done();
};





var fs = require('fs');
var oJSON = JSON.parse(fs.readFileSync('./resources/model/intents.json'));
var oRules = recognizer.parseRules(oJSON);


exports.testRecognizerWs = function (test) {
  var Recognizer = new (recognizer.RegExpRecognizer)(oRules);

  var oContext = {
    message: {
      text: 'list all applications '
    }
  };

  Recognizer.recognize(oContext, function (err, res) {
    test.deepEqual(res,
      {
        entities:
        [{
          type: 'categories',
          entity: 'applications',
          startIndex: 9,
          endIndex: 21
        }
        ],
        score: 0.9,
        intent: 'ListAll'
      }

      , 'correct result');
    test.done();
  });
};


exports.testTrimValueAdjusting= function(test) {
  test.deepEqual(recognizer.trimValueAdjusting('abc '), { deltaStart : 0, value : 'abc'}, 'correct result');
  test.deepEqual(recognizer.trimValueAdjusting('  abc '), { deltaStart : 2, value : 'abc'}, 'correct result');
  test.deepEqual(recognizer.trimValueAdjusting(' \t abc'), { deltaStart : 3, value : 'abc'}, 'correct result');
  test.done();
};


exports.testRecognizerListallID = function (test) {
  var Recognizer = new (recognizer.RegExpRecognizer)(oRules);

  var oContext = {
    message: {
      text: 'list all applications, def, hij and klm in domain XYZ'
    }
  };

  Recognizer.recognize(oContext, function (err, res) {
    test.deepEqual(res,
      { entities:
      [{
        type: 'categories',
        entity: 'applications, def, hij and klm in domain XYZ',
        startIndex: 9,
        endIndex: 53 }
      ],
      score: 0.9,
      intent: 'ListAll' }
      , 'correct result');
    test.done();
  });
};


exports.testRecognizeSome = function (test) {
  var oRules = recognizer.parseRules(oJSON);
  var Recognizer = new (recognizer.RegExpRecognizer)(oRules);

  var oContext = {
    message: {
      text: 'Show me Transaction ABC in UV2 client 130'
    }
  };

  Recognizer.recognize(oContext, function (err, res) {
    test.deepEqual(res,
      {
        entities:
        [{
          type: 'A1',
          entity: 'Transaction ABC in UV2 client 130',
          startIndex: 8,
          endIndex: 41
        }
        ],
        score: 0.9,
        intent: 'ShowMe'
      }

      , 'correct result');
    test.done();
  });
};

exports.testRecognizeDescribe = function (test) {
  var oRules = recognizer.parseRules(oJSON);
  var Recognizer = new (recognizer.RegExpRecognizer)(oRules);

  var oContext = {
    message: {
      text: 'describe AB'
    }
  };

  Recognizer.recognize(oContext, function (err, res) {
    test.deepEqual(res,
      {
        entities:
        [{
          type: 'A1',
          entity: 'AB',
          startIndex: 9,
          endIndex: 11
        }
        ],
        score: 0.9,
        intent: 'Describe'
      }
      , 'correct result');
    test.done();
  });
};


exports.testRecognizeDescribeUppercase = function (test) {
  var oRules = recognizer.parseRules(oJSON);
  var Recognizer = new (recognizer.RegExpRecognizer)(oRules);

  var oContext = {
    message: {
      text: 'Describe AB'
    }
  };

  Recognizer.recognize(oContext, function (err, res) {
    test.deepEqual(res,
      {
        entities:
        [{
          type: 'A1',
          entity: 'AB',
          startIndex: 9,
          endIndex: 11
        }
        ],
        score: 0.9,
        intent: 'Describe'
      }
      , 'correct result');
    test.done();
  });
};


exports.testRecognizeTellMeDescribe = function (test) {
  var oRules = recognizer.parseRules(oJSON);
  var Recognizer = new (recognizer.RegExpRecognizer)(oRules);

  var oContext = {
    message: {
      text: 'describe AB'
    }
  };

  Recognizer.recognize(oContext, function (err, res) {
    test.deepEqual(res,
      {
        entities:
        [{
          type: 'A1',
          entity: 'AB',
          startIndex: 9,
          endIndex: 11
        }
        ],
        score: 0.9,
        intent: 'Describe'
      }
      , 'correct result');
    test.done();
  });
};

exports.testRecognizeTellMeAb = function (test) {
  var oRules = recognizer.parseRules(oJSON);
  var Recognizer = new (recognizer.RegExpRecognizer)(oRules);

  var oContext = {
    message: {
      text: 'Tell me about AB'
    }
  };

  Recognizer.recognize(oContext, function (err, res) {
    test.deepEqual(res,
      {
        entities:
        [{
          type: 'A1',
          entity: 'AB',
          startIndex: 14,
          endIndex: 16
        }
        ],
        score: 0.9,
        intent: 'Describe'
      }
      , 'correct result');
    test.done();
  });
};


exports.testRecognizeTellMe = function (test) {
  var oRules = recognizer.parseRules(oJSON);
  var Recognizer = new (recognizer.RegExpRecognizer)(oRules);

  var oContext = {
    message: {
      text: 'Tell me about AB in domain Fiori BOM.'
    }
  };

  Recognizer.recognize(oContext, function (err, res) {
    test.deepEqual(res,
      {
        entities:
        [{
          type: 'A1',
          entity: 'AB',
          startIndex: 14,
          endIndex: 16
        },
        {
          type: 'D',
          entity: 'Fiori BOM',
          startIndex: 27,
          endIndex: 36
        }
        ],
        score: 0.9,
        intent: 'Describe'
      }
      , 'correct result');
    test.done();
  });
};



exports.testRecognizeTellMeFi = function (test) {
  var oRules = recognizer.parseRules(oJSON);
  var Recognizer = new (recognizer.RegExpRecognizer)(oRules);

  var oContext = {
    message: {
      text: 'Tell me about "Fiori intent"?'
    }
  };

  Recognizer.recognize(oContext, function (err, res) {
    test.deepEqual(res,
      {
        entities:
        [{
          type: 'A1',
          entity: '"Fiori intent"',
          startIndex: 14,
          endIndex: 28
        }
        ],
        score: 0.9,
        intent: 'Describe'
      }
      , 'correct result');
    test.done();
  });
};

exports.testRecognizeWhatIsSimpleA = function (test) {
  var oRules = recognizer.parseRules(oJSON);
  var Recognizer = new (recognizer.RegExpRecognizer)(oRules);

  var oContext = {
    message: {
      text: 'What is a Businesscatalog'
    }
  };

  Recognizer.recognize(oContext, function (err, res) {
    test.deepEqual(res,
      {
        entities:
        [{
          type: 'A1',
          entity: '"Businesscatalog"',
          startIndex: 10,
          endIndex: 25
        }
        ],
        score: 0.9,
        intent: 'Describe'
      }
      , 'correct result');
    test.done();
  });
};

exports.testRecognizeWhatIsSimpleA = function (test) {
  var oRules = recognizer.parseRules(oJSON);
  var Recognizer = new (recognizer.RegExpRecognizer)(oRules);

  var oContext = {
    message: {
      text: 'What is a Businesscatalog'
    }
  };

  Recognizer.recognize(oContext, function (err, res) {
    test.deepEqual(res,
      {
        entities:
        [{
          type: 'A1',
          entity: 'Businesscatalog',
          startIndex: 10,
          endIndex: 25
        }
        ],
        score: 0.9,
        intent: 'Describe'
      }
      , 'correct result');
    test.done();
  });
};


exports.testRecognizeWhatIsComplex = function (test) {
  var oRules = recognizer.parseRules(oJSON);
  var Recognizer = new (recognizer.RegExpRecognizer)(oRules);

  var oContext = {
    message: {
      text: 'What is the element weight for element name silver'
    }
  };

  Recognizer.recognize(oContext, function (err, res) {
    test.deepEqual(res,
      {
        entities:
        [{
          type: 'category',
          entity: 'element weight',
          startIndex: 12,
          endIndex: 26
        },
        {
          type: 'A1',
          entity: 'element name silver',
          startIndex: 31,
          endIndex: 50
        }
        ],
        score: 0.9,
        intent: 'WhatIs'
      }
      , 'correct result');
    test.done();
  });
};



exports.testRecognizeWhatIsSimple = function (test) {
  var oRules = recognizer.parseRules(oJSON);
  var Recognizer = new (recognizer.RegExpRecognizer)(oRules);

  var oContext = {
    message: {
      text: 'What is water'
    }
  };

  Recognizer.recognize(oContext, function (err, res) {
    test.deepEqual(res,
      {
        entities:
        [{
          type: 'A1',
          entity: 'water',
          startIndex: 8,
          endIndex: 13
        }
        ],
        score: 0.9,
        intent: 'Describe'
      }
      , 'correct result');
    test.done();
  });
};


exports.testRecognizeTellMeD2 = function (test) {
  var oRules = recognizer.parseRules(oJSON);
  var Recognizer = new (recognizer.RegExpRecognizer)(oRules);

  var oContext = {
    message: {
      text: 'Describe ASF SFA in domain Fiori BOM.'
    }
  };

  Recognizer.recognize(oContext, function (err, res) {
    test.deepEqual(res,
      {
        entities:
        [{
          type: 'A1',
          entity: 'ASF SFA',
          startIndex: 9,
          endIndex: 16
        },
        {
          type: 'D',
          entity: 'Fiori BOM',
          startIndex: 27,
          endIndex: 36
        }
        ],
        score: 0.9,
        intent: 'Describe'
      }
      , 'correct result');
    test.done();
  });
};


exports.testRecognizeSomeMore = function (test) {

  var oRules = recognizer.parseRules(oJSON);
  var Recognizer = new (recognizer.RegExpRecognizer)(oRules);

  var oContext = {
    message: {
      text: 'What is the ABC for DEF in KLM'
    }
  };
  Recognizer.recognize(oContext, function (err, res) {
    test.deepEqual(res,
      {
        entities:
        [{
          type: 'category',
          entity: 'ABC',
          startIndex: 12,
          endIndex: 15
        },
        {
          type: 'A1',
          entity: 'DEF in KLM',
          startIndex: 20,
          endIndex: 30
        }
        ],
        score: 0.9,
        intent: 'WhatIs'
      }
      , 'correct result');
    test.done();
  });
};


exports.testRecognizeBuildTable = function (test) {

  var oRules = recognizer.parseRules(oJSON);
  var Recognizer = new (recognizer.RegExpRecognizer)(oRules);

  var oContext = {
    message: {
      text: 'build table with appId, fiori intent, AppNAme, AppplicaitonComponent, BSPName, OData Service, BUsinessCatalog, TechnicalCatalog and ApplicationComponent'
    }
  };
  Recognizer.recognize(oContext, function (err, res) {
    test.deepEqual(res,
      {
        entities:
        [{
          type: 'categories',
          entity: 'appId, fiori intent, AppNAme, AppplicaitonComponent, BSPName, OData Service, BUsinessCatalog, TechnicalCatalog and ApplicationComponent',
          startIndex: 17,
          endIndex: 152
        }
        ],
        score: 0.9,
        intent: 'buildtable'
      }
      , 'correct result');
    test.done();
  });
};




exports.testRecognizeListAllBinOp = function (test) {

  var oRules = recognizer.parseRules(oJSON);
  var Recognizer = new (recognizer.RegExpRecognizer)(oRules);

  var oContext = {
    message: {
      text: 'List all ABC starting with DEF'
    }
  };
  Recognizer.recognize(oContext, function (err, res) {
    test.deepEqual(res,
      {
        entities:
        [{
          type: 'categories',
          entity: 'ABC starting with DEF',
          startIndex: 9,
          endIndex: 30
        }
        ],
        score: 0.9,
        intent: 'ListAll'
      }
      , 'correct result');
    test.done();
  });
};

exports.testRecognizeListAllBinOpDomain = function (test) {

  var oRules = recognizer.parseRules(oJSON);
  var Recognizer = new (recognizer.RegExpRecognizer)(oRules);

  var oContext = {
    message: {
      text: 'List all ABC starting with DEF in domain UU'
    }
  };
  Recognizer.recognize(oContext, function (err, res) {
    test.deepEqual(res,
      {
        entities:
        [{
          type: 'categories',
          entity: 'ABC starting with DEF in domain UU',
          startIndex: 9,
          endIndex: 43
        }
        ],
        score: 0.9,
        intent: 'ListAll'
      }
      , 'correct result');
    test.done();
  });
};



exports.testRecognizeListAllWhere = function (test) {

  var oRules = recognizer.parseRules(oJSON);
  var Recognizer = new (recognizer.RegExpRecognizer)(oRules);

  var oContext = {
    message: {
      text: 'List all ABC where XYZ starts with X'
    }
  };
  Recognizer.recognize(oContext, function (err, res) {
    test.deepEqual(res,
      {
        entities:
        [{
          type: 'categories',
          entity: 'ABC where XYZ starts with X',
          startIndex: 9,
          endIndex: 36
        }
        ],
        score: 0.9,
        intent: 'ListAll'
      }
      , 'correct result');
    test.done();
  });
};

exports.testtrimTrailingSentenceDelimiters = function(test) {
  test.equal(recognizer.trimTrailingSentenceDelimiters('abc !!!?!'), 'abc');
  test.equal(recognizer.trimTrailingSentenceDelimiters('abc '), 'abc');
  test.equal(recognizer.trimTrailingSentenceDelimiters('defhij " \n !!\n!?!'), 'defhij "');
  test.equal(recognizer.trimTrailingSentenceDelimiters('defhij'), 'defhij');
  test.equal(recognizer.trimTrailingSentenceDelimiters(''), '');

  test.done();
};

exports.testRecognizeListAllWhereTails = function (test) {
  var oRules = recognizer.parseRules(oJSON);
  var Recognizer = new (recognizer.RegExpRecognizer)(oRules);
  var cnt = 0;
  var arr =
  ['?', '???', '!?!', '!', ';', '.'];
  arr.forEach(function(term) {
    var oContext = {
      message: {
        text: 'List all ABC where XYZ starts with X' + term
      }
    };
    Recognizer.recognize(oContext, function (err, res) {
      test.deepEqual(res,
        {
          entities:
          [{
            type: 'categories',
            entity: 'ABC where XYZ starts with X',
            startIndex: 9,
            endIndex: 36
          }
          ],
          score: 0.9,
          intent: 'ListAll'
        }
        , 'correct result');
      cnt = cnt + 1;
      if(cnt === arr.length) {
        test.done();
      }
    });
  });
};

// TODO
exports.testRecognizeWith = function (test) {

  var oRules = recognizer.parseRules(oJSON);
  var Recognizer = new (recognizer.RegExpRecognizer)(oRules);

  var oContext = {
    message: {
      text: 'List all ABC with XYZ starting with X'
    }
  };
  Recognizer.recognize(oContext, function (err, res) {
    test.deepEqual(res,
      {
        entities:
        [{
          type: 'categories',
          entity: 'ABC with XYZ starting with X',
          startIndex: 9,
          endIndex: 37
        }
        ],
        score: 0.9,
        intent: 'ListAll'
      }
      , 'correct result');
    test.done();
  });
};

exports.testNormalizeWhitespace = function(test) {
  test.deepEqual(recognizer.normalizeWhitespace(' This is  \t  not\t"a love song"   and "we do like the USofA  '),
    ' This is not "a love song" and "we do like the USofA ');
  test.done();
};

exports.testCompactQuoted = function (test) {
  test.deepEqual(recognizer.compactQuoted(' This is not "a love song" and "we do like" the USofA'),
    ' This is not <word> and <word> the USofA');
  test.done();
};

exports.testCompactQuotedUnterminated = function (test) {
  test.deepEqual(recognizer.compactQuoted(' This is not "a love song" and "we do like the USofA'),
    ' This is not <word> and "we do like the USofA');

  test.done();
};

exports.testCountCompactWords = function (test) {
  test.deepEqual(recognizer.countCompactWords('a b c d e f g h k i l m n'),10);
  //test.deepEqual(recognizer.countCompactWords('a,c,d,e,f,g h k i l m n'),10);
  //test.deepEqual(recognizer.countCompactWords('a,b,c,d,e f g h k i l m n'),10);
  test.done();
};


exports.testCountCompactWords = function (test) {

  test.deepEqual(recognizer.countCompactWords(' a b '),4);
  test.deepEqual(recognizer.countCompactWords('a,,,,,,,b, , , , ,c '),4);
  test.done();
};



exports.testRecognizeTooLong = function (test) {
  var ambRules = {
    'Exit': [
      'Quit',
    ]
  };
  var ambiguousRules = recognizer.parseRules(ambRules);
  var Recognizer = new (recognizer.RegExpRecognizer)(ambiguousRules);
  var oContext = {
    message: {
      text: 'This message has too many characters to be procesed by the wosap in his own time frame wiht current limits and more fun to the limit than anyboader else and so on'
    }
  };
  Recognizer.recognize(oContext, function (err, res) {
    test.deepEqual(res,
      {
        entities: [],
        score: 1,
        intent: 'TooLong'
      }
      , 'correct result');
    test.done();
  });
};


exports.testRecognizeTooLong2 = function (test) {
  var ambRules = {
    'Exit': [
      'QuAAAAA',
    ]
  };
  var ambiguousRules = recognizer.parseRules(ambRules);
  var Recognizer = new (recognizer.RegExpRecognizer)(ambiguousRules);
  var oContext = {
    message: {
      text: 'This messagehastoo many charactersTobaprocesswdfbjoealkdfjaoeslf saladsfsfasfdalkfja slfkjsafsjflskjfslkfj'
      +  'slkfjaslkdfjsalkfjsklfjslfkjasdasflkfdjaslökfjaslkdfjasölfkjassffkjaslökdfjaslkdfjassafldfjsasafadfasdfskjsdlkfjasldkfjaslkdfjsalfkjslkdfjaslkfjslakdfjslkfdjlskdfjslkfjslkfdj'
      +  'slkfjaslkdfjsalkfjsklfjslfkjasdasflkfdjaslökfjaslkdfjasölfkjassffkjaslökdfjaslkdfjassafldfjsasafadfasdfskjsdlkfjasldkfjaslkdfjsalfkjslkdfjaslkfjslakdfjslkfdjlskdfjslkfjslkfdj'
      +  'slkfjaslkdfjsalkfjsklfjslfkjasdasflkfdjaslökfjaslkdfjasölfkjassffkjaslökdfjaslkdfjassafldfjsasafadfasdfskjsdlkfjasldkfjaslkdfjsalfkjslkdfjaslkfjslakdfjslkfdjlskdfjslkfjslkfdj'
    }
  };
  new Promise(function(resolve,reject) {
    Recognizer.recognize(oContext, function (err, res) {
      test.deepEqual(res.intent,'TooLong');
      resolve();
    });
  }).then(function() {
    return new Promise(function(resolve,reject) {
      var oContext = {
        message: {
          text: 'This h t m w a a i sl d d d d df  s f f e  af f asf  fs ds fs fs df sf s fs '
        }
      };
      Recognizer.recognize(oContext, function (err, res) {
        test.deepEqual(res.intent,'TooLong');
        resolve();
      });
    });
  }
  ).then(function() {
    test.done();
  });
};



exports.testRecognizeNone = function (test) {
  var Recognizer = new (recognizer.RegExpRecognizer)(oRules);
  var oContext = {
    message: {
      text: 'This is nothing parsed'
    }
  };

  Recognizer.recognize(oContext, function (err, res) {
    test.deepEqual(res,
      {
        entities: [],
        score: 0.1,
        intent: 'None'
      }

      , 'correct result');
    test.done();
  });
};



exports.testRecognizeAmbiguous = function (test) {

  var ambRules = {
    'Exit': [
      'Quit',
      'Leave',
      'Exit',
      'Abandon'
    ],
    'Wrong': [
      'Exit',
      'incorrect',
      'Liar'
    ]
  };
  var ambiguousRules = recognizer.parseRules(ambRules);
  var Recognizer = new (recognizer.RegExpRecognizer)(ambiguousRules);
  var oContext = {
    message: {
      text: 'Exit'
    }
  };

  Recognizer.recognize(oContext, function (err, res) {
    test.deepEqual(res,
      {
        entities: [],
        score: 0.9,
        intent: 'Exit'
      }
      , 'correct result');
    test.done();
  });
};

