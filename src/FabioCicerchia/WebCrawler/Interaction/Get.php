<?php

namespace FabioCicerchia\WebCrawler\Interaction;

use FabioCicerchia\WebCrawler\Crawler;
use FabioCicerchia\WebCrawler\Interaction;

class Get extends Interaction
{
    public static function elaborate(array $links, $baseUrl)
    {
        foreach($links as $link) {
            if (isset(Crawler::$urls['get'][$link])) {
                continue;
            }

            echo "Processing (GET) '$link'..." . PHP_EOL;
            Crawler::$urls['get'][$link] = 1;
            Crawler::run($link, $baseUrl);
        }

    }
}