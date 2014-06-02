grunt-ssh2
==========

## Tasks

### deploy

```js

  grunt.config("deploy", {
    options: {
      host: "xx.xx.xxx.xxx",
      username: process.env.USERNAME,
      password: process.env.PASSWORD
    },
    development: {
      src: [
        ".../.../.../",
        ".../.../.../"
      ],
      dest: "/home/www/server/apps/test"
    }
  })

```