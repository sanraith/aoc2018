/* eslint-disable */

// bitwise check
/*  0 */ e = 123;
/*  1 */ e = e & 456;
// IF E === 72 COUNTINUE, ELSE JUMP TO START.
/*  2 */ e = e === 72 ? 1 : 0;
/*  3 */ ip = e + ip;
/*  4 */ ip = 0;


/*  5 */ e = 0;
    /*  6 */ c = e | 65536;
    /*  7 */ e = 6152285;
        /*  8 */ b = c & 255;
        /*  9 */ e = e + b;
        /* 10 */ e = e & 16777215;
        /* 11 */ e = e * 65899;
        /* 12 */ e = e & 16777215;

        // if c <= 256 JUMP TO 28, ELSE CONTINUE
        /* 13 */ b = 256 > c ? 1 : 0;
        /* 14 */ ip = b + ip;
        /* 15 */ ip = ip + 1;
        /* 16 */ ip = 27;

        /* 17 */ b = 0;

            /* 18 */ f = b + 1;
            /* 19 */ f = f * 256;

            // IF f > c JUMP 26, ELSE CONTINUE
            /* 20 */ f = f > c ? 1 : 0;
            /* 21 */ ip = f + ip;
            /* 22 */ ip = ip + 1;
            /* 23 */ ip = 25;

            /* 24 */ b = b + 1;
            //JUMP TO 18
            /* 25 */ ip = 17;

        /* 26 */ c = b;
        // JUMP TO 8
        /* 27 */ ip = 7;

    // IF e === a !!!END!!! ELSE JUMP 6
    /* 28 */ b = e === a ? 1 : 0;
    /* 29 */ ip = b + ip;
    /* 30 */ ip = 5;