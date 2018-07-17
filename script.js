var MYAPP = MYAPP || {
  check: false,
  count: 1,
  timeOuts: [],
  checkStrict: false
};
//массив последовательности цветов
var arr = [];
//включаем бегунок
MYAPP.gameOn = function() {
  $("#offon").on("click", function() {
    if (!MYAPP.check) {
      $("#begunok").css("marginLeft", "20px");
      $("#screen").css("color", "red");
      //даем знать всем функциям, что бегунок включен
      MYAPP.check = true;
      //можем выключать бегунок
      MYAPP.gameOff();
      //можем нажимать кнопку старт
      $("#st").on("click", function() {
        MYAPP.start();
      });
      //можем нажимать кнопку строгого режима
      MYAPP.checkStrict = false;
      MYAPP.strictOn();
    }
  });
};
MYAPP.gameOff = function() {
  $("#offon").on("click", function() {
    //даем знать всем функциям, что бегунок выключен
    MYAPP.check = false;
    //возвращаем все цвета в первоначальное состояние
    $("#begunok").css("marginLeft", "0px");
    $("#screen")
      .css("color", "#7f0000")
      .text("--");
    $("#lamp").css("background", "#454545");
    $("td").removeClass("light");
    //можем включать бегунок
    MYAPP.gameOn();
    //возвращаем счет игры в первоначальное состояние
    MYAPP.count = 1;
    MYAPP.game.check = true;
    //нельзя включать строгий режим
    MYAPP.checkStrict = true;
    //обнуляем число кликов
    MYAPP.game.count = 0;
    MYAPP.timeOuts.forEach(function(timer) {
      clearTimeout(timer);
    });
    //запрещаем нажимать на сектора
    MYAPP.game.check = true;
    // обнуляем массивы порядка цветов и кликов
    arr = [];
  });
};
  //строгий режим
MYAPP.strictOn = function() {
    $("#str").on("click", function() {
      //включаем режим strict
      if (!MYAPP.checkStrict && MYAPP.check) {
        $("#lamp").css("background", "red");
        MYAPP.checkStrict = !MYAPP.checkStrict;
        //выключаем режим strict
      } else if (MYAPP.checkStrict && MYAPP.check) {
        $("#lamp").css("background", "#454545");
        MYAPP.checkStrict = !MYAPP.checkStrict;
      }
    });
};
//включаем игру
MYAPP.start = function() {
  if (MYAPP.check) {
    //обнуляем все еще раз на случай нажатия в середине игры
    MYAPP.timeOuts.forEach(function(timer) {
      clearTimeout(timer);
    });
    MYAPP.game.check = true;
    $("td").removeClass("light");
    $("#screen").text("--");
    arr = [];
    MYAPP.game.count = 0;
    MYAPP.count = 1;
    //начало игры - мигание
    MYAPP.game.flash();
    //можно кликать
    MYAPP.game.click();
    //задаем порядок цветов
    MYAPP.timeOuts.push(
      setTimeout(function() {
        $("#screen").text("0" + MYAPP.count);
        MYAPP.game.color();
      }, 1600)
    );
    //что делать, если игрок ничего не нажал
    MYAPP.game.continue();
  }
};
MYAPP.game = {
  //считаем клики
  count: 0,
  //проверяем, можно ли кликать
  check: true,
  //функция мигания
  flash: function() {
    MYAPP.timeOuts.push(
      setTimeout(function() {
        $("#screen").css("color", "#7f0000");
      }, 300),
      setTimeout(function() {
        $("#screen").css("color", "red");
      }, 600),
      setTimeout(function() {
        $("#screen").css("color", "#7f0000");
      }, 900),
      setTimeout(function() {
        $("#screen").css("color", "red");
      }, 1200)
    );
  },
  //рандомный цвет
  random: function() {
    return Math.round(Math.random() * (4 - 1) + 1);
  },
  //порядок цветов
  color: function() {
    if (MYAPP.game.check) {
      //добавляем в массим цвета, только если игрок все правильно нажал
      if (MYAPP.game.count === arr.length) {
        MYAPP.game.count = 0;
        var random = MYAPP.game.random();
        arr.push(random);
      }
      var i = 0;
      //показываем все цвета в массиве
      function ColorTurn() {
        MYAPP.timeOuts.forEach(function(timer) {
          clearTimeout(timer);
        });
        $("#" + arr[i]).addClass("light");
        MYAPP.timeOuts.push(
          setTimeout(function() {
            $("#" + arr[i]).removeClass("light");
            MYAPP.timeOuts.push(
              setTimeout(function() {
                if (i !== arr.length - 1) {
                  i++;
                  ColorTurn();
                } else {
                  i = 0;
                  MYAPP.game.check = false;
                  MYAPP.game.continue();
                }
              }, 200)
            );
          }, 1000)
        );
        MYAPP.game.sound(MYAPP.game.music[arr[i]]);
      }
      ColorTurn();
    }
  },
  //звук для цвета
  sound: function(sound) {
    var audio = new Audio();
    audio.src = sound;
    audio.autoplay = true;
  },
  //выбор самих звуков
  music: {
    1: "https://s3.amazonaws.com/freecodecamp/simonSound1.mp3",
    2: "https://s3.amazonaws.com/freecodecamp/simonSound2.mp3",
    3: "https://s3.amazonaws.com/freecodecamp/simonSound3.mp3",
    4: "https://s3.amazonaws.com/freecodecamp/simonSound4.mp3"
  },
  //что делать по клику
  click: function() {
    $("td").on("mousedown", function() {
      //проверяем выполнены ли все необходимые действия до кликов
      if (!MYAPP.game.check) {
        MYAPP.game.sound(MYAPP.game.music[$(this).attr("id")]);
        $(this)
          .addClass("light")
          .on("mouseup", function() {
            $(this).removeClass("light");
          });
        MYAPP.game.count++;
        //если пользователь не ту кнопку нажал и строгий режим выключен
        if ($(this).attr("id") != arr[MYAPP.game.count - 1]) {
          MYAPP.game.count = 0;
          MYAPP.timeOuts.forEach(function(timer) {
            clearTimeout(timer);
          });
          if (!MYAPP.checkStrict) {
            MYAPP.game.checkTime();
          } else {
            MYAPP.game.strictFail();
          }
          MYAPP.game.check = true;
          MYAPP.game.click = function() {};
          //если пользователь не ту кнопку нажал и строгий режим включен
        } else if ($(this).attr("id") == arr[MYAPP.game.count - 1]) {
          MYAPP.timeOuts.forEach(function(timer) {
            clearTimeout(timer);
          });
          MYAPP.game.continue();
        }
        //если все правильно нажал
        if (MYAPP.game.count === arr.length && MYAPP.count !== 19) {
          MYAPP.game.check = true;
          MYAPP.timeOuts.forEach(function(timer) {
            clearTimeout(timer);
          });
          MYAPP.timeOuts.push(
            setTimeout(function() {
              MYAPP.count++;
              MYAPP.count < 10
                ? $("#screen").text("0" + MYAPP.count)
                : $("#screen").text(MYAPP.count);
              MYAPP.game.color();
            }, 1500)
          );
          MYAPP.game.click = function() {};
          //если он выиграл
        } else if (MYAPP.game.count === arr.length && MYAPP.count === 19) {
          $("#screen").text("**");
          var blick = function() {
            $("#" + arr[MYAPP.game.count - 1]).toggleClass("light");
          };
          MYAPP.timeOuts.push(
            setTimeout(blick, 200),
            setTimeout(blick, 400),
            setTimeout(blick, 600),
            setTimeout(blick, 800),
            setTimeout(blick, 1000),
            setTimeout(blick, 1200)
          );
        }
      }
    });
  },
  //если пользователь 5 сек бездействует
  continue: function() {
    if (MYAPP.check) {
      MYAPP.timeOuts.push(
        setTimeout(function() {
          //если режим strict включен
          if (MYAPP.checkStrict) {
            MYAPP.game.strictFail();
            //если режим strict выключен
          } else if (!MYAPP.checkStrict) {
            if (MYAPP.game.count !== arr.length) {
              MYAPP.game.checkTime();
            }
          }
        }, 5000)
      );
    }
  },
  //напоминаем игроку последовательность
  checkTime: function() {
    if (MYAPP.check) {
      $("#screen").text("!!");
      MYAPP.game.flash();
      MYAPP.timeOuts.push(
        setTimeout(function() {
          MYAPP.count < 10
            ? $("#screen").text("0" + MYAPP.count)
            : $("#screen").text(MYAPP.count);
          MYAPP.game.check = true;
          MYAPP.game.color();
          MYAPP.game.continue();
        }, 1600)
      );
    }
  },
  //если пользователь ошибся в строгом режиме
  strictFail: function() {
    $("#screen").text("!!");
    MYAPP.game.flash();
    MYAPP.timeOuts.push(
      setTimeout(function() {
        MYAPP.start();
      }, 1500)
    );
  }
};

$(document).ready(function() {
  MYAPP.gameOn();
});
