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
        cwd: "_site-production/assets",
        src: "**"
      }
    },

    jekyll: {
      options: {
        config: "_config.yml"
      },
      dev: {
        options: {
          serve: true,
          auto: true
        }
      },
      dist: {
        options: {
          config: "_config-prod.yml,_config.yml"
        }
      }
    },

    watch: {
      files: ["**/*.html", "**/*.css", "**/*.scss", "**/*.js", "!_site/*", "!_site-production/*"]
    },

    concurrent: {
      jekyllDev: {
        tasks: ['jekyll:dev', 'watch'],
        options: {
          logConcurrentOutput: true
        }
      }
    },

    environments: {
      staging: {
        options: {
          host: "<%= creds.host %>",
          username: "<%= creds.username %>",
          password: "<%= creds.password %>",
          deploy_path: "/var/www/streamkeys_staging",
          local_path: "_site-production",
          current_symlink: "current"
        }
      },

      production: {
        options: {
          host: "<%= creds.host %>",
          username: "<%= creds.username %>",
          password: "<%= creds.password %>",
          deploy_path: "/var/www/streamkeys_live",
          local_path: "_site-production",
          current_symlink: "current"
        }
      }
    }
  });

  grunt.registerTask("build", ["jekyll:dist"]);
  grunt.registerTask("stage-deploy", ["jekyll:dist", "s3", "ssh_deploy:staging"]);
  grunt.registerTask("prod-deploy", ["jekyll:dist", "s3", "ssh_deploy:production"]);
  grunt.registerTask("jekyll-dev", ["concurrent:jekyllDev"]);

  grunt.loadNpmTasks("grunt-aws");
  grunt.loadNpmTasks("grunt-jekyll");
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks("grunt-ssh-deploy");
  grunt.loadNpmTasks('grunt-concurrent');
};
