<?php

namespace FabioCicerchia\WebCrawler;

use FabioCicerchia\WebCrawler\Dom;

class Parser
{
    public static function getLinks($html, $baseUrl) {
        $urls = array();

        Dom::load($html);
        
        foreach(Dom::$object->getElementsByTagName('a') as $anchor) {
            array_push($urls, self::getURI($anchor->getAttribute('href'), $baseUrl));
        }

        foreach(Dom::$object->getElementsByTagName('form') as $anchor) {
            array_push($urls, self::getURI($anchor->getAttribute('action'), $baseUrl));
        }

        return array_unique($urls);
    }
    
    protected static function getURI($item, $baseUrl) {
        $item = trim($item);
        $sameBaseUrl = substr($item, 0, strlen($baseUrl)) === $baseUrl;
        if (empty($item) || (!$sameBaseUrl && ($item[0] !== '/' || substr($item, 0, 2) === '//') && $item[0] !== '#')) {
            return;
        }

        return $sameBaseUrl ? $item : ($baseUrl . $item);
    }

    public static function getInputs($html) {
        $inputs = array();

        Dom::load($html);
        
        foreach(Dom::$object->getElementsByTagName('input') as $item) {
            array_push($inputs, $item->getAttribute('name'));
        }
        
        foreach(Dom::$object->getElementsByTagName('select') as $item) {
            array_push($inputs, $item->getAttribute('name'));
        }
        
        foreach(Dom::$object->getElementsByTagName('textarea') as $item) {
            array_push($inputs, $item->getAttribute('name'));
        }

        return array_unique($inputs);
    }
}