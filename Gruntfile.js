module.exports = function(grunt) {
    grunt.initConfig({
        watch: {
            files: ['**/*', '!**/node_modules/**', '!**/.git/**'],
            tasks: ['shell']
        },
        shell: {
            update: {
                command: 'npm run update',
                options: {
                    stdout: true
                }
            },
            test: {
                command: 'npm run test',
                options: {
                    stdout: true
                }
            },
            deploy: {
                command: 'npm run deploy',
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
