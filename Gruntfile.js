module.exports = function (grunt){
       grunt.initConfig({
		      clean:{
		      	   css:['www/build/release/css/*.css'],
				   js:['www/build/release/js/*.js']
			  },
             cssmin: {
			       options: {
						 shorthandCompacting: false,
						 roundingPrecision: -1,
						 keepSpecialComments: 0
					},
                   target: {
						files: {
							'www/build/release/css/datepicker.min.css': ['www/lib/datepicker-for-ionic/dist/datepicker.css'],
						 }
				   }  
			  },
			  uglify: {
                    options: {
					    mangle: false,
					    compress: {
							drop_console: true
						 }
					},
					my_target: {
					  files: {
						   'www/build/release/js/applicationtop.min.js': ['www/js/common/loader.js', 'www/js/common/ajaxloader.js', 'www/js/common/global.js', 'www/js/controllers/app.js', 'www/js/controllers/directives.js']
					    }
					 }
				  } 
		});
		grunt.loadNpmTasks('grunt-contrib-clean');
		grunt.loadNpmTasks('grunt-contrib-cssmin');
		grunt.loadNpmTasks('grunt-contrib-uglify');
	    grunt.registerTask('default', ['clean','cssmin','uglify']);
}