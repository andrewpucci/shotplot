module.exports = {

  // Some default locations
  paths: {
    build: {
      src: 'src',
      dest: 'dist',
    },
    scripts: {
      custom: {
        src: ['./src/js/**/*.js'],
        dest: ['./src/site/assets/js'],
      },
      deps: {
        src: [
          './node_modules/jquery/dist/jquery.min.js',
          './node_modules/@popperjs/core/dist/umd/popper.min.js',
          './node_modules/bootstrap/dist/js/bootstrap.min.js',
          './node_modules/datatables.net/js/jquery.dataTables.js',
          './node_modules/datatables.net-bs5/js/dataTables.bootstrap5.js',
          './node_modules/datatables.net-buttons/js/dataTables.buttons.min.js',
          './node_modules/datatables.net-buttons/js/buttons.html5.min.js',
          './node_modules/datatables.net-buttons-bs5/js/buttons.bootstrap5.min.js',
        ],
        dest: ['./src/site/assets/js'],
      },
    },
    styles: {
      custom: {
        src: ['./src/scss/*.scss'],
        dest: ['./src/site/assets/css'],
      },
      deps: {
        src: [
          './node_modules/datatables.net-bs5/css/dataTables.bootstrap5.css',
          './node_modules/datatables.net-buttons-bs5/css/buttons.bootstrap5.css',
        ],
        dest: ['./src/site/assets/css'],
      },
    },
  },
};
