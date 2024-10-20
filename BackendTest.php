<?php
require_once 'CurlClient.php';
require_once 'Backend.php';
use PHPUnit\Framework\TestCase;

/**
 * BackendTest class tests the functions `fetchAccessToken` and `fetchTasks`
 * that use the CurlClient to perform HTTP requests.
 */
class BackendTest extends TestCase
{
    /**
     * Test fetchAccessToken to ensure it retrieves the access token correctly
     * by mocking the CurlClient's behavior.
     */
    public function testFetchAccessToken()
    {
        // Create a mock CurlClient instance
        $mockCurlClient = $this->createMock(CurlClient::class);

        // Mock CurlClient methods
        $mockCurlClient->expects($this->once())
            ->method('init')
            ->willReturn(true);

        $mockCurlClient->expects($this->once())
            ->method('setOptions')
            ->with($this->isType('array'))
            ->willReturn(true);

        $mockCurlClient->expects($this->once())
            ->method('execute')
            ->willReturn(json_encode([
                'oauth' => ['access_token' => 'mock_access_token']
            ]));

        $mockCurlClient->expects($this->once())
            ->method('close')
            ->willReturn(true);

        // Call fetchAccessToken and check the access token
        $response = fetchAccessToken($mockCurlClient, 'mockUser', 'mockPass', 'mockAuthHeader');
        $this->assertEquals('mock_access_token', $response['oauth']['access_token']);
    }

    /**
     * Test fetchTasks to ensure tasks are fetched and returned correctly
     * by mocking the CurlClient's behavior.
     */
    public function testFetchTasks()
    {
        // Create a mock CurlClient instance
        $mockCurlClient = $this->createMock(CurlClient::class);

        // Mock CurlClient methods
        $mockCurlClient->expects($this->once())
            ->method('init')
            ->willReturn(true);

        $mockCurlClient->expects($this->once())
            ->method('setOptions')
            ->with($this->isType('array'))
            ->willReturn(true);

        $mockCurlClient->expects($this->once())
            ->method('execute')
            ->willReturn(json_encode([
                ['task' => 'Task 1', 'id' => 1],
                ['task' => 'Task 2', 'id' => 2]
            ]));

        $mockCurlClient->expects($this->once())
            ->method('close')
            ->willReturn(true);

        // Call fetchTasks and validate the task data
        $tasks = fetchTasks($mockCurlClient, 'mock_access_token');
        $this->assertCount(2, $tasks);
        $this->assertEquals('Task 1', $tasks[0]['task']);
        $this->assertEquals(1, $tasks[0]['id']);
    }
}
