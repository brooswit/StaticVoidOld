module.exports = function(grunt) {
    grunt.initConfig({
        watch: {
            files: ['**/*', '!**/node_modules/**', '!**/.git/**'],
            tasks: ['shell']
        },
        shell: {
            test: {
                command: 'npm run test',
                options: {
                    stdout: true
                }
            },
            update: {
                command: 'npm run update',
                options: {
                    stdout: true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch')
    grunt.loadNpmTasks('grunt-shell');

    grunt.registerTask('default', ['shell:test', 'shell:update', 'watch']);
};
