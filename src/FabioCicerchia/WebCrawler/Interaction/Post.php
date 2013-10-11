<?php

namespace FabioCicerchia\WebCrawler\Interaction;

use FabioCicerchia\WebCrawler\Crawler;
use FabioCicerchia\WebCrawler\Interaction;
use FabioCicerchia\WebCrawler\Test;

class Post extends Interaction
{
    public static function elaborate(array $links, array $fields, $baseUrl)
    {
        foreach($links as $link) {
            if (isset(Crawler::$urls['post'][$link])) {
                continue;
            }

            $data = array_combine($fields, $fields);
            $serializedData = http_build_query($data);

            $tests = Test::getCases(md5($link));
            var_dump($tests); return; // TODO: FIX THIS
            echo "Processing (POST) '$link'..." . PHP_EOL;
            Crawler::$urls['post'][$link . $serializedData] = 1;
            Crawler::run($link, $baseUrl, $data);
        }
    }
}