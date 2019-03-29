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
          './node_modules/popper.js/dist/umd/popper.min.js',
          './node_modules/bootstrap/dist/js/bootstrap.min.js',
          './node_modules/datatables.net/js/jquery.dataTables.js',
          './node_modules/datatables.net-bs4/js/dataTables.bootstrap4.js',
          './node_modules/datatables.net-buttons/js/dataTables.buttons.min.js',
          './node_modules/datatables.net-buttons/js/buttons.html5.min.js',
          './node_modules/datatables.net-buttons-bs4/js/buttons.bootstrap4.min.js',
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
          './node_modules/datatables.net-bs4/css/dataTables.bootstrap4.css',
          './node_modules/datatables.net-buttons-bs4/css/buttons.bootstrap4.min.css',
        ],
        dest: ['./src/site/assets/css'],
      },
    },
  },
};
