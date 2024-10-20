<?php
class CurlClient
{
    private $curlHandle;

    public function init()
    {
        $this->curlHandle = curl_init();
        return $this->curlHandle;
    }

    public function setOptions(array $options)
    {
        return curl_setopt_array($this->curlHandle, $options);
    }

    public function execute()
    {
        return curl_exec($this->curlHandle);
    }

    public function getError()
    {
        return curl_error($this->curlHandle);
    }

    public function close()
    {
        if ($this->curlHandle) {
            curl_close($this->curlHandle);
        }
    }
}
