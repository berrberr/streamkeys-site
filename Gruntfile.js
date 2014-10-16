module.exports = function(grunt) {

  grunt.initConfig({

    creds: grunt.file.readJSON("credentials.json"),

    s3: {
      options: {
        accessKeyId: "<%= creds.accessKeyId %>",
        secretAccessKey: "<%= creds.secretAccessKey %>",
        bucket: "streamkeys"
      },
      build: {
        cwd: "build/_site-production/assets",
        src: "**"
      }
    },

    jekyll: {
      dev: {
        options: {
          config: "_config.yml"
        }
      },
      dist: {
        options: {
          config: "_config.yml,_config-prod.yml"
        }
      }
    },

    watch: {
      files: ["code/**/*.html", "code/**/*.css", "code/**/*.scss", "code/**/*.js", "!build/*"]
    },

    environments: {
      staging: {
        options: {
          host: "<%= creds.host %>",
          username: "<%= creds.username %>",
          password: "<%= creds.password %>",
          deploy_path: "/var/www/streamkeys_staging",
          local_path: "./build/_site-production",
          current_symlink: "current"
        }
      },

      production: {
        options: {
          host: "<%= creds.host %>",
          username: "<%= creds.username %>",
          password: "<%= creds.password %>",
          deploy_path: "/var/www/streamkeys_live",
          local_path: "./build/_site-production",
          current_symlink: "current"
        }
      }
    }
  });

  grunt.registerTask("build", ["jekyll:dist"]);
  grunt.registerTask("stage-deploy", ["jekyll:dist", "s3", "ssh_deploy:staging"]);
  grunt.registerTask("prod-deploy", ["jekyll:dist", "s3", "ssh_deploy:production"]);

  grunt.loadNpmTasks("grunt-aws");
  grunt.loadNpmTasks("grunt-jekyll");
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks("grunt-ssh-deploy");
};
