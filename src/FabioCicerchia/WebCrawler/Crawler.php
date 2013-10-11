<?php

namespace FabioCicerchia\WebCrawler;

use FabioCicerchia\WebCrawler\Interaction\Get;
use FabioCicerchia\WebCrawler\Interaction\Post;
use FabioCicerchia\WebCrawler\Parser;
use FabioCicerchia\WebCrawler\Url;

class Crawler
{
    static $urls = array('get' => array(), 'post' => array());

    public static function run($url, $baseUrl) {
        $html  = Url::getHtml($url);
        $links = Parser::getLinks($html, $baseUrl);

        Get::elaborate($links, $baseUrl);

        $fields = Parser::getInputs($html);
        if (empty($fields)) {
            return;
        }
        
        self::createTestCases($url, $fields);

        Post::elaborate($links, $fields, $baseUrl);
    }
    
    public static function createTestCases($url, $fields)
    {
        $id = preg_replace('/[^a-zA-Z0-9_-]/', '', $url);
        
        $data = array_flip($fields);
        Test::createCase($id . '-empty', $data);
        
        $data = array_combine($fields, $fields);
        Test::createCase($id . '-fake', $data);
        
        $data = array_flip($fields);
        Test::createCase($id . '-skeleton', $data);
    }
}