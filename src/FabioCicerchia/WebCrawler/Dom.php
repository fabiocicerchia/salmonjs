<?php

namespace FabioCicerchia\WebCrawler;

class Dom
{
    public static $object = null;
    
    public static function load($html)
    {
        libxml_use_internal_errors(true);
        self::$object = new \DOMDocument();
        self::$object->recover = true;
        self::$object->strictErrorChecking = false;
        
        if (!empty($html)) {
            self::$object->loadHTML($html);
        }
    }
}