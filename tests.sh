#!/bin/bash

assert () {
    echo -n "Test '$1': "
    RESPONSE=$(./bin/crawler --uri "$1" | grep "Launching crawler" | wc -l)
    [ "$RESPONSE" -eq "$2" ] && echo "true" || echo "false ($RESPONSE)"
}

assert "tests/test_01.html" "1"
assert "tests/test_02.html" "2"
assert "tests/test_03.html" "2"
assert "tests/test_04.html" "4"
assert "tests/test_05.html" "4"
assert "tests/test_06.html" "6"
assert "tests/test_07.html" "4"
assert "tests/test_08.html" "4"
assert "tests/test_09.html" "6"
assert "tests/test_10.html" "6"
assert "tests/test_11.html" "6"
assert "tests/test_12.html" "2"
assert "tests/test_13.html" "3" # TODO: is not getting the value from document.location
assert "tests/test_14.html" "3"
assert "tests/test_15.html" "8"
assert "tests/test_16.html" "2"
assert "tests/test_17.html" "3" # TODO: is not getting the value from onclick
