-- 1. Total pagado por cada cliente
-- "Como administrador del sistema, necesito saber cuánto ha pagado cada cliente en
-- total, para poder llevar un control de los ingresos y verificar los saldos generales."
SELECT
    c.id AS client_id,
    c.name AS client_name,
    SUM(t.amount) AS total_paid
FROM
    clients c
JOIN
    invoices i ON c.id = i.client_id
JOIN
    transactions t ON i.id = t.invoice_id
GROUP BY
    c.id, c.name
ORDER BY
    total_paid DESC;

-- 2. Facturas pendientes con información de cliente y transacción asociada
-- "Como responsable financiero, necesito identificar las facturas que aún no han sido
-- pagadas completamente, junto con el nombre del cliente y la transacción
-- correspondiente, para gestionar el cobro o seguimiento."
SELECT
    i.id AS invoice_id,
    i.period AS invoice_period,
    c.name AS client_name,
    c.email AS client_email,
    t.id AS transaction_id,
    t.amount AS transaction_amount,
    t.status AS transaction_status,
    t.transaction_date,
    p.name AS platform_name
FROM
    invoices i
JOIN
    clients c ON i.client_id = c.id
LEFT JOIN
    transactions t ON i.id = t.invoice_id
LEFT JOIN
    platforms p ON t.platform_id = p.id
WHERE
    t.status = 'pending'
ORDER BY
    t.transaction_date ASC;

-- 3. Listado de transacciones por plataforma
-- "Como analista, necesito poder ver todas las transacciones hechas desde una
-- plataforma específica (como Nequi o Daviplata), incluyendo a qué cliente
-- pertenecen y qué factura están pagando."
SELECT
    p.name AS platform_name,
    t.id AS transaction_id,
    t.amount AS transaction_amount,
    t.transaction_date,
    c.name AS client_name,
    i.id AS invoice_id
FROM
    transactions t
JOIN
    platforms p ON t.platform_id = p.id
JOIN
    invoices i ON t.invoice_id = i.id
JOIN
    clients c ON i.client_id = c.id
WHERE
    -- p.name = 'Daviplata'
    p.name = 'Nequi' 
ORDER BY
    t.transaction_date DESC;
