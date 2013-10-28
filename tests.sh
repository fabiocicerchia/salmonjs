#!/bin/bash
[ $(./bin/crawler --url "tests/test_01.html" | grep "Launching crawler" | wc -l) -eq "1" ] && echo "true" || echo "false"
[ $(./bin/crawler --url "tests/test_02.html" | grep "Launching crawler" | wc -l) -eq "2" ] && echo "true" || echo "false"
[ $(./bin/crawler --url "tests/test_03.html" | grep "Launching crawler" | wc -l) -eq "2" ] && echo "true" || echo "false"
[ $(./bin/crawler --url "tests/test_04.html" | grep "Launching crawler" | wc -l) -eq "4" ] && echo "true" || echo "false"
[ $(./bin/crawler --url "tests/test_05.html" | grep "Launching crawler" | wc -l) -eq "4" ] && echo "true" || echo "false"
[ $(./bin/crawler --url "tests/test_06.html" | grep "Launching crawler" | wc -l) -eq "6" ] && echo "true" || echo "false"
[ $(./bin/crawler --url "tests/test_07.html" | grep "Launching crawler" | wc -l) -eq "4" ] && echo "true" || echo "false"
[ $(./bin/crawler --url "tests/test_08.html" | grep "Launching crawler" | wc -l) -eq "4" ] && echo "true" || echo "false"
[ $(./bin/crawler --url "tests/test_09.html" | grep "Launching crawler" | wc -l) -eq "6" ] && echo "true" || echo "false"
[ $(./bin/crawler --url "tests/test_10.html" | grep "Launching crawler" | wc -l) -eq "6" ] && echo "true" || echo "false"
[ $(./bin/crawler --url "tests/test_11.html" | grep "Launching crawler" | wc -l) -eq "6" ] && echo "true" || echo "false"
[ $(./bin/crawler --url "tests/test_12.html" | grep "Launching crawler" | wc -l) -eq "2" ] && echo "true" || echo "false"
[ $(./bin/crawler --url "tests/test_13.html" | grep "Launching crawler" | wc -l) -eq "3" ] && echo "true" || echo "false" # TODO: is not getting the value from document.location
[ $(./bin/crawler --url "tests/test_14.html" | grep "Launching crawler" | wc -l) -eq "3" ] && echo "true" || echo "false"
[ $(./bin/crawler --url "tests/test_15.html" | grep "Launching crawler" | wc -l) -eq "8" ] && echo "true" || echo "false"
[ $(./bin/crawler --url "tests/test_16.html" | grep "Launching crawler" | wc -l) -eq "2" ] && echo "true" || echo "false"
[ $(./bin/crawler --url "tests/test_17.html" | grep "Launching crawler" | wc -l) -eq "3" ] && echo "true" || echo "false" # TODO: is not getting the value from onclick