ACLOCAL_AMFLAGS=-I m4
lib_LTLIBRARIES = libSKELETON.la
libSKELETON_la_SOURCES = SKELETON.cpp
libSKELETON_la_CXXFLAGS = -std=c++17 ${LIBECS_CFLAGS} ${JSONCPP_CFLAGS} ${LIBTHE_SEED_CFLAGS}
libSKELETON_la_LDFLAGS = -no-undefined
libSKELETON_la_LIBADD = ${LIBECS_LIBS} ${JSONCPP_LIBS} ${LIBTHE_SEED_LIBS}
