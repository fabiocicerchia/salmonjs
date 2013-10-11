<?php

namespace FabioCicerchia\WebCrawler;

class Test
{
    const TEST_CASE_DIRECTORY = '/../../../tests/cases/';

    public static function createCase($name, $data)
    {
        $testCaseFile = __DIR__ . self::TEST_CASE_DIRECTORY . $name . '.tst';
        $content      = '';
        foreach($data as $key => $value) {
            $content .= $key . '=' . $value . PHP_EOL;
        }

        is_dir(__DIR__ . self::TEST_CASE_DIRECTORY) || mkdir(__DIR__ . self::TEST_CASE_DIRECTORY, 0777, true);
        file_put_contents($testCaseFile, $content);
    }

    public static function getCases($prefix)
    {
        $cases = array();

        foreach (glob(__DIR__ . self::TEST_CASE_DIRECTORY . '/' . $prefix . '-*.tst') as $filename) {
            array_push($cases, self::parseCase($filename));
        }

        return $cases;
    }

    public static function parseCase($filename)
    {
        $content = file_get_contents($filename);
        $lines   = explode(PHP_EOL, $content);

        $data = new DataContainer;
        foreach($lines as $line) {
            $line = trim($line);
            if (empty($line)) {
                continue;
            }

            list($key, $value) = preg_split('/=/', $line, 2);
            $data->data[$key] = $value;
        }

        return $data;
    }
}