AC_PREREQ([2.69])
AC_INIT([SKELETON], [0.0.1], [AUTHOR_EMAIL], [SKELETON], [AUTHOR_URL])
AC_CONFIG_HEADERS([config.h])
AC_PROG_CXX
AM_INIT_AUTOMAKE([subdir-objects])
LT_INIT([disable-static])

AC_CONFIG_MACRO_DIR([m4])

PKG_CHECK_MODULES([LIBECS], ecs-cpp)
PKG_CHECK_MODULES([JSONCPP], jsoncpp)
PKG_CHECK_MODULES([LIBTHE_SEED], the-seed)

AC_CHECK_HEADER([windows.h],
    [LIBS="$LIBS"],
    [LIBS="$LIBS -ldl"],
    [])

AC_OUTPUT(Makefile src/Makefile)
