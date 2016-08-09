var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var notify = require('gulp-notify');
var jshint = require('gulp-jshint');
var ejs = require('gulp-ejs');
var gutil = require('gulp-util');


var JSfiles = "./public/javascripts/*.js";
var myJSfiles = "./public/app/**/*.js";
var myEJSfiles = "./views/**/*.ejs";

var outputJSDir = "./builds/scripts/"
var outputEJSDir = "./builds/dev/"

gulp.task('scripts', function() {
  return gulp.src(JSfiles)
  .pipe(concat('script.js'))
  .pipe(uglify())
  .pipe(gulp.dest(outputJSDir))
  .pipe(notify('Uglify DODE !!!'))
});

// Lint Task
gulp.task('mylint', function () {
  return gulp.src(myJSfiles)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('lint', function () {
  return gulp.src(files)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('myejs', function(){
  return gulp.src(myEJSfiles)
   .pipe(ejs({}, {ext:'.html'}))
   .on('error', gutil.log)
   .pipe(gulp.dest(outputEJSDir))
});

/*
https://www.youtube.com/watch?v=dwSLFai8ovQ
http://andy-carter.com/blog/a-beginners-guide-to-the-task-runner-gulp
https://www.npmjs.com/package/gulp-inject/#optionsstarttag

npm install --save-dev jshint gulp-jshint
npm install --save-dev jshint-stylish

gulp.task('copyEJS', function () {
  return gulp.src('views/*.ejs')
      .pipe(gulp.dest('site/'));
});

gulp.task('js', function() {
  return gulp.src(files)
  .pipe(uglify())
  .pipe(concat('script.js'))
  .pipe(gulp.dest(outputDir))
  .pipe(connect.reload())
});

//Aqui criamos uma nova tarefa através do ´gulp.task´ e damos a ela o nome 'lint'
gulp.task('lint', function() {

  return gulp.src(files)
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

gulp.task('watch', function(){
  gulp.watch(['./javascripts/*.js'], ['scripts']);
});

gulp.task('default', ['nodemon']);

/*
//Criamos uma tarefa 'default' que vai rodar quando rodamos `gulp` no projeto
gulp.task('default', function() {

// Usamos o `gulp.run` para rodar as tarefas
// E usamos o `gulp.watch` para o Gulp esperar mudanças nos arquivos para rodar novamente
//    gulp.run('lint', 'default');
    gulp.start('nodemon');

    gulp.watch(files, function(evt) {
//    gulp.run('lint', 'default');
  });
});

gulp.task('default', ['nodemon', 'watch']);
*/
