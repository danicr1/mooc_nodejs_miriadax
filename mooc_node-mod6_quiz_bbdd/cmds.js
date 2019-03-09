/* eslint-disable */
const Sequelize = require('sequelize');
const { log, biglog, errorlog, colorize } = require("./out");
const { models } = require('./model');


/**
 * Muestra la ayuda.
 *
 * @param rl Objeto readline usado para implementar el CLI.
 */
exports.helpCmd = rl => {
    log("Commandos:");
    log("  h|help - Muestra esta ayuda.");
    log("  list - Listar los quizzes existentes.");
    log("  show <id> - Muestra la pregunta y la respuesta el quiz indicado.");
    log("  add - Añadir un nuevo quiz interactivamente.");
    log("  delete <id> - Borrar el quiz indicado.");
    log("  edit <id> - Editar el quiz indicado.");
    log("  test <id> - Probar el quiz indicado.");
    log("  p|play - Jugar a preguntar aleatoriamente todos los quizzes.");
    log("  credits - Créditos.");
    log("  q|quit - Salir del programa.");
    rl.prompt();
};


/**
 * Lista todos los quizzes existentes en el modelo.
 *
 * @param rl Objeto readline usado para implementar el CLI.
 */
exports.listCmd = rl => {
    models.quiz.findAll()
        .each(quiz => {
            log(` [${colorize(quiz.id, 'magenta')}]:  ${quiz.question}`);
        })
        .catch(error => {
            errorlog(error.nessage);
        })
        .then(() => {
            rl.prompt();
        })
};

/**
 * Esta función devuelve una promesa que:
 *   - Valida que se ha introducido un valor para un parámetro
 *   - Convierte el parámetro en un número entero
 * @param id Indice a validar.
 */
const validateId = id => {
    return new Sequelize.Promise((resolve, reject) => {
        if (typeof id === "undefined") {
            reject(new Error('Falta el parámetro id'));
        } else {
            id = parseInt(id);
            if (Number.isNaN(id)) {
                reject(new Error('El valor de id no es un número'));
            } else {
                resolve(id);
            }
        }
    });
};

/**
 * Muestra el quiz indicado en el parámetro: la pregunta y la respuesta.
 *
 * @param rl Objeto readline usado para implementar el CLI.
 * @param id Clave del quiz a mostrar.
 */
exports.showCmd = (rl, id) => {
    validateId(id)
        .then(id => models.quiz.findById(id))
        .then(quiz => {
            if (!quiz) {
                throw new Error(`No existe el quiz asociado a la id ${id}`);
            }
            log(` [${colorize(quiz.id, 'magenta')}]:  ${quiz.question} ${colorize('=>', 'magenta')} ${quiz.answer}`);
        })
        .catch(error => {
            errorlog(error.nessage);
        })
        .then(() => {
            rl.prompt();
        });
};

/**
 * Esta función convierte la llamada rl.question, basada en callbacks,
 * en una función basada en promesas
 * 
 * @param rl Objeto readline usado para implementar el CLI.
 * @param text Pregunta que hay que hacerle al usuario.
 */
const makeQuestion = (rl, text) => {
    return new Sequelize.Promise((resolve, reject) => {
        rl.question(colorize(`${text} `, 'red'), answer => {
            resolve(answer.trim());
        });
    });
};


/**
 * Añade un nuevo quiz al módelo.
 * Pregunta interactivamente por la pregunta y por la respuesta.
 *
 * Hay que recordar que el funcionamiento de la funcion rl.question es asíncrono.
 * El prompt hay que sacarlo cuando ya se ha terminado la interacción con el usuario,
 * es decir, la llamada a rl.prompt() se debe hacer en la callback de la segunda
 * llamada a rl.question.
 *
 * @param rl Objeto readline usado para implementar el CLI.
 */
exports.addCmd = rl => {

    makeQuestion(rl, 'Intrduzca una pregunta: ')
        .then(q => {
            return makeQuestion(rl, 'Intrduzca la respuesta: ')
                .then(a => {
                    return { question: q, answer: a };
                })
        })
        .then(quiz => {
            return models.quiz.create(quiz);
        })
        .then((quiz) => {
            log(` ${colorize('Se ha añadido', 'magenta')}: ${quiz.question} ${colorize('=>', 'magenta')} ${quiz.answer}`);
        })
        .catch(Sequelize.ValidationError, error => {
            errorlog('El quiz es erróneo:');
            error.errors.forEach(({ message }) => errorlog(message));
        })
        .catch(error => {
            errorlog(error.nessage);
        })
        .then(() => {
            rl.prompt();
        });
};


/**
 * Borra un quiz del modelo.
 *
 * @param rl Objeto readline usado para implementar el CLI.
 * @param id Clave del quiz a borrar en el modelo.
 */
exports.deleteCmd = (rl, id) => {
    validateId(id)
        .then(id => models.quiz.destroy({ where: { id } }))
        .catch(error => {
            errorlog(error.message);
        })
        .then(() => {
            rl.prompt();
        });
};


/**
 * Edita un quiz del modelo.
 *
 * Hay que recordar que el funcionamiento de la funcion rl.question es asíncrono.
 * El prompt hay que sacarlo cuando ya se ha terminado la interacción con el usuario,
 * es decir, la llamada a rl.prompt() se debe hacer en la callback de la segunda
 * llamada a rl.question.
 *
 * @param rl Objeto readline usado para implementar el CLI.
 * @param id Clave del quiz a editar en el modelo.
 */
exports.editCmd = (rl, id) => {
    validateId(id)
        .then(id => models.quiz.findById(id))
        .then(quiz => {
            if (!quiz) {
                throw new Error(`No existe el quiz asociado a la id ${id}`);
            }

            process.stdout.isTTY && setTimeout(() => { rl.write(quiz.question) }, 0);
            return makeQuestion(rl, 'Introduzca la pregunta: ')
                .then(q => {
                    process.stdout.isTTY && setTimeout(() => { rl.write(quiz.answer) }, 0);
                    return makeQuestion(rl, 'Introduzca la respuesta: ')
                        .then(a => {
                            quiz.question = q;
                            quiz.answer = a;
                            return quiz;
                        });
                });
        })
        .then(quiz => {
            return quiz.save();
        })
        .then(quiz => {
            log(` Se ha cambiado el quiz ${colorize(quiz.id, 'magenta')} por: ${quiz.question} ${colorize('=>', 'magenta')} ${quiz.answer}`);
        })
        .catch(Sequelize.ValidationError, error => {
            errorlog('El quiz es erróneo:');
            error.errors.forEach(({ message }) => errorlog(message));
        })
        .catch(error => {
            errorlog(error.message);
        })
        .then(() => {
            rl.prompt();
        });
};


/**
 * Prueba un quiz, es decir, hace una pregunta del modelo a la que debemos contestar.
 *
 * @param rl Objeto readline usado para implementar el CLI.
 * @param id Clave del quiz a probar.
 */
exports.testCmd = (rl, id) => {
    validateId(id)
        .then(id => models.quiz.findById(id))
        .then(quiz => {
            if (!quiz) {
                throw new Error(`No existe el quiz asociado a la id ${id}`);
            }
            return makeQuestion(rl, quiz.question)
                .then(answer => {
                    if (answer.toLowerCase() === quiz.answer.toLowerCase()) {
                        log('Su respuesta es correcta');
                        biglog('Correcta', 'green');
                    } else {
                        log('Su respuesta es incorrecta');
                        biglog('Incorrecta', 'red');
                    }
                });
        })
        .catch(error => {
            errorlog(error.message);
        })
        .then(() => {
            rl.prompt();
        });
};


/**
 * Pregunta todos los quizzes existentes en el modelo en orden aleatorio.
 * Se gana si se contesta a todos satisfactoriamente.
 *
 * @param rl Objeto readline usado para implementar el CLI.
 */
exports.playCmd = rl => {
    let puntos = 0;
    let quizzesArray = [];

    /**
     * Función auxiliar que cambia el orden de los elementos de un array aleatoriamente.
    */
    function shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
    }

    /**
     * Función recursiva que sigue haciendo preguntas mientras no falles
     * la respuesta y sigan quedando preguntas por responder.
    */
    const hacerPreguntas = () => {
        if (quizzesArray.length > 0) { // Mientras queden preguntas
            let quiz = quizzesArray[quizzesArray.length - 1]; // Cogemos el último elemento
            makeQuestion(rl, quiz.question)
                .then(answer => {
                    if (answer.toLowerCase() === quiz.answer.toLowerCase()) {
                        puntos++;
                        log('Su respuesta es correcta');
                        log(`Aciertos: ${puntos}`);
                        quizzesArray.pop(); // Eliminamos el quiz que hemos acertado (el último)
                        hacerPreguntas(); // Si acierta sigue jugando
                    } else {
                        log('Su respuesta es incorrecta');
                        log(`Puntuación final: ${puntos}`);
                        log('Fin del juego');
                        rl.prompt();
                    }
                });
        } else { // Si ya no quedan preguntas
            log(`¡Enhorabuena, acertó todas las preguntas!`);
            log(`Puntuación final: ${puntos}`);
            log('Fin del juego');
            rl.prompt();
        }
    };

    models.quiz.findAll()
        .then(quizzes => {
            quizzesArray = quizzes;
            shuffle(quizzesArray);
            hacerPreguntas();
        })
        .catch(error => {
            errorlog(error.message);
        })
        .then(() => {
            rl.prompt();
        });
};


/**
 * Muestra los nombres de los autores de la práctica.
 *
 * @param rl Objeto readline usado para implementar el CLI.
 */
exports.creditsCmd = rl => {
    log('Autor de la práctica:');
    log('Daniel Criado Benítez', 'green');
    rl.prompt();
};


/**
 * Terminar el programa.
 *
 * @param rl Objeto readline usado para implementar el CLI.
 */
exports.quitCmd = rl => {
    rl.close();
};
