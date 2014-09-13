module.exports = function(grunt) {

  grunt.initConfig({

    aws: grunt.file.readJSON("aws-credentials.json"),

    s3: {
      options: {
        accessKeyId: "<%= aws.accessKeyId %>",
        secretAccessKey: "<%= aws.secretAccessKey %>",
        bucket: "streamkeys"
      },
      build: {
        cwd: "_site-production/assets",
        src: "**"
      }
    },

    jekyll: {
      options: {
        config: "_config.yml"
      },

      dist: {
        options: {
          config: "_config-prod.yml,_config.yml"
        }
      }
    }
  });

  grunt.registerTask("prod", ["jekyll:dist", "s3"]);

  grunt.loadNpmTasks('grunt-aws');
  grunt.loadNpmTasks('grunt-jekyll');
};
