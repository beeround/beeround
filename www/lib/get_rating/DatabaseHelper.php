<?php


class DatabaseHelper
{
    /**
     * @var \mysqli[]
     */
    protected $connections;

    /**
     * @Flow\InjectConfiguration(package="Koempf.Utilities", path="DatabaseHelper")
     * @var array
     */
    protected $settings = [
        'Connections' => [
            'default' => [
                'hostname' => '127.0.0.1',
                'user' => 'dev',
                'password' => 'dev',
                'database' => 'beeround',
            ]
        ]
    ];

    /**
     * @param string $key
     * @return \mysqli
     * @throws \Exception
     */
    public function getConnection($key = null)
    {
        if (empty($key)) {
            $key = 'default';
        }
        if (!isset($this->connections[$key])) {
            if (empty($this->settings['Connections'][$key]['hostname'])) {
                throw new \Exception('Connection ' . $key . ' not found!');
            }
            $connection = new \mysqli(
                $this->settings['Connections'][$key]['hostname'],
                $this->settings['Connections'][$key]['user'],
                $this->settings['Connections'][$key]['password'],
                $this->settings['Connections'][$key]['database']
            );
            if ($connection->connect_errno) {
                throw new \Exception('Connect failed: ' . $connection->connect_error);
            }
            if (empty($connection)) {
                throw new \Exception('Connect failed');
            }
            $connection->set_charset('utf8');
            $this->connections[$key] = $connection;
        }
        return $this->connections[$key];
    }

    /**
     * @param string $query
     * @return array
     * @throws \Exception
     */
    public function getRows($query)
    {
        $result = $this->getResult($query);
        $rows = mysqli_fetch_all($result, MYSQLI_ASSOC);
        $result->close();
        return $rows;
    }

    /**
     * @param string $query
     * @return array|null
     */
    public function getRow($query)
    {
        $result = $this->getResult($query);
        $row = $result->fetch_assoc();
        $result->close();
        return $row;
    }

    /**
     * @param string $query
     * @return string
     */
    public function getValue($query)
    {
        $row = $this->getRow($query);
        if (empty($row)) {
            return null;
        }
        return array_values($row)[0];
    }

    /**
     * @param string $query
     * @return array
     */
    public function getValues($query)
    {
        $values = [];
        $rows = $this->getRows($query);
        foreach ($rows as $row) {
            $row = array_values($row);
            if (count($row) === 1) {
                $values[] = $row[0];
            } else {
                $values[$row[0]] = $row[1];
            }
        }
        return $values;
    }

    /**
     * @param string $value
     * @return string
     */
    public function getEscapedString($value)
    {
        return $this->getConnection()->escape_string($value);
    }

    /**
     * @param array $values
     * @return string
     */
    public function getEscapedList(array $values)
    {
        foreach ($values as $key => $value) {
            $values[$key] = $this->getEscapedString($value);
        }
        return '"' . implode('", "', $values) . '"';
    }

    /**
     * @param string $query
     * @param callable $callableFunction
     * @return void
     */
    public function getRowsIterator($query, callable $callableFunction)
    {
        $result = $this->getResult($query);
        $counter = 0;
        while ($row = $result->fetch_assoc()) {
            $callableFunction($row, $counter++);
        }
        $result->close();
    }

    /**
     * @param string $query
     * @return \mysqli
     * @throws \Exception
     */
    public function getConnectionByQuery($query)
    {
        $split = preg_split('/\s+/', trim($query), 2);
        if (count($split) <= 1) {
            throw new \Exception('Could not found method in query "' . $query . '"');
        }
        $method = strtolower($split[0]);
        foreach ($this->settings['Connections'] as $key => $connection) {
            if (!empty($connection['methods']) && in_array($method, $connection['methods'], true)) {
                return $this->getConnection($key);
            }
        }
        return $this->getConnection();
    }

    /**
     * @param string $query
     * @return \mysqli_result
     * @throws \Exception
     */
    public function getResult($query)
    {
        if (($result = $this->getConnectionByQuery($query)->query($query)) === false) {
            throw new \Exception('Query failed: ' . $this->getConnectionByQuery($query)->error);
        }
        return $result;
    }
}