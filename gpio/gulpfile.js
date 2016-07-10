var gulp = require('gulp');


var nodemon = require('gulp-nodemon');
//var uglyfy = require('gulp-uglyfy');


var files = "./src/*.js";

/*
gulp.task('copyEJS', function () {
  gulp.src('views/*.ejs')
      .pipe(gulp.dest('site/'));
});

gulp.task('compress', function () {
  return gulp.src('views/*.ejs')
         .pipe(uglyfy())
         .pipe(gulp.dest('site/'));
});
*/

//Aqui criamos uma nova tarefa através do ´gulp.task´ e damos a ela o nome 'lint'
/*
gulp.task('lint', function() {

  gulp.src(files)
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});
*/

gulp.task('nodemon', function() {

  nodemon({
    script: './bin/www',
    ext: 'js ejs html',
    env : {
      'NODE_ENV' : 'development',
      'PORT': '3000'
    },
    ignore: ['./node_modules/**']
  })
  .on('restart', function () {
    console.log("Restarting the server !!!")
  });
});

//Criamos uma tarefa 'default' que vai rodar quando rodamos `gulp` no projeto
gulp.task('default', function() {

// Usamos o `gulp.run` para rodar as tarefas
// E usamos o `gulp.watch` para o Gulp esperar mudanças nos arquivos para rodar novamente
//    gulp.run('lint', 'default');
    gulp.run('nodemon');

    gulp.watch(files, function(evt) {
//    gulp.run('lint', 'default');
  });
});
