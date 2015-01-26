module.exports = function(grunt) {
    // load plugins
    [
        'grunt-cafe-mocha',
        'grunt-contrib-jshint',
        'grunt-exec'
    ].forEach(function(task) {
        grunt.loadNpmTasks(task);
    });

    // configure plugins

    grunt.initConfig({
        cafemocha: {
            all: { src: 'assets/qa/tests-*.js', options: { ui: 'tdd'}, }
        },
        jshint: {
            app: ['virtualscan.js', 'public/js/**/*.js', 'lib/**/*.js'],
            qa: ['Gruntfile.js', 'public/qa/**/*.js', 'assets/qa/**/*.js'],
            },
        exec: {
            linkchecker:
                { cmd: 'linkchecker http://localhost:3000' }
        },
    });

    // register tasks
    grunt.registerTask('default', ['cafemocha', 'jshint', 'exec']);
};
