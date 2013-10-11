<?php

namespace FabioCicerchia\WebCrawler;

use Guzzle\Http\Client;

class Url
{
    public static function getHtml($url, $data = array()) {
        if (empty($url)) {
            return null;
        }

        $urlParts = parse_url($url);
        $baseUrl  = self::getEntryPoint($urlParts);
        $relUrl   = self::getRelativePart($urlParts);
        
        $client  = new Client($baseUrl);
        
        if (!empty($data)) {
            $request = $client->post($relUrl, array(), $data);
        } else {
            $request = $client->get($relUrl);
        }
        
        try {
            $response = $request->send();
            return $response->getBody();
        } catch (\Guzzle\Http\Exception\ClientErrorResponseException $e) {
            return null;
        }
    }
    
    public static function getEntryPoint($parsedUrl)
    {
        $scheme   = isset($parsedUrl['scheme'])   ? $parsedUrl['scheme'] . '://' : '';
        $host     = isset($parsedUrl['host'])     ? $parsedUrl['host']           : '';
        $port     = isset($parsedUrl['port'])     ? ':' . $parsedUrl['port']     : '';
        $user     = isset($parsedUrl['user'])     ? $parsedUrl['user']           : '';
        $pass     = isset($parsedUrl['pass'])     ? ':' . $parsedUrl['pass']     : '';
        $pass     = ($user || $pass)               ? "$pass@"                      : '';
        
        return "$scheme$user$pass$host$port";
    }
    
    public static function getRelativePart($parsedUrl)
    {
        $path     = isset($parsedUrl['path'])     ? $parsedUrl['path']           : '';
        $query    = isset($parsedUrl['query'])    ? '?' . $parsedUrl['query']    : '';
        $fragment = isset($parsedUrl['fragment']) ? '#' . $parsedUrl['fragment'] : '';
        
        return "$path$query$fragment";
    }
    
    public static function unparse_url($parsedUrl)
    {
        return self::getEntryPoint($parsedUrl) . getRelativePart($parsedUrl);
    }
}