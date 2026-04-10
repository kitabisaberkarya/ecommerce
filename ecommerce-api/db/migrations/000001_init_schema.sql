-- ============================================================
-- Migration: 000001_init_schema
-- Description: Core e-commerce database schema
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- for full-text search

-- ============================================================
-- USERS
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id               UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    email            VARCHAR(255) NOT NULL UNIQUE,
    password_hash    TEXT         NOT NULL,
    full_name        VARCHAR(255) NOT NULL,
    phone            VARCHAR(20)  NOT NULL DEFAULT '',
    avatar_url       TEXT         NOT NULL DEFAULT '',
    role             VARCHAR(20)  NOT NULL DEFAULT 'customer' CHECK (role IN ('admin', 'seller', 'customer')),
    is_active        BOOLEAN      NOT NULL DEFAULT TRUE,
    email_verified_at TIMESTAMPTZ,
    created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    deleted_at       TIMESTAMPTZ
);

CREATE INDEX idx_users_email    ON users (email) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_role     ON users (role)  WHERE deleted_at IS NULL;

-- ============================================================
-- REFRESH TOKENS
-- ============================================================
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id         UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id    UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token      TEXT        NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    revoked_at TIMESTAMPTZ
);

CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens (user_id);
CREATE INDEX idx_refresh_tokens_token   ON refresh_tokens (token);

-- ============================================================
-- ADDRESSES
-- ============================================================
CREATE TABLE IF NOT EXISTS addresses (
    id             UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id        UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    label          VARCHAR(50)  NOT NULL DEFAULT 'Rumah',
    recipient_name VARCHAR(255) NOT NULL,
    phone          VARCHAR(20)  NOT NULL,
    province       VARCHAR(100) NOT NULL,
    city           VARCHAR(100) NOT NULL,
    district       VARCHAR(100) NOT NULL DEFAULT '',
    postal_code    VARCHAR(10)  NOT NULL,
    address_line   TEXT         NOT NULL,
    is_default     BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_addresses_user_id ON addresses (user_id);

-- ============================================================
-- CATEGORIES
-- ============================================================
CREATE TABLE IF NOT EXISTS categories (
    id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id   UUID        REFERENCES categories(id) ON DELETE SET NULL,
    name        VARCHAR(100) NOT NULL,
    slug        VARCHAR(150) NOT NULL UNIQUE,
    description TEXT         NOT NULL DEFAULT '',
    image_url   TEXT         NOT NULL DEFAULT '',
    is_active   BOOLEAN      NOT NULL DEFAULT TRUE,
    sort_order  INT          NOT NULL DEFAULT 0,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_categories_slug      ON categories (slug);
CREATE INDEX idx_categories_parent_id ON categories (parent_id);

-- ============================================================
-- PRODUCTS
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
    id           UUID             PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_id    UUID             NOT NULL REFERENCES users(id),
    category_id  UUID             NOT NULL REFERENCES categories(id),
    name         VARCHAR(255)     NOT NULL,
    slug         VARCHAR(300)     NOT NULL UNIQUE,
    description  TEXT             NOT NULL DEFAULT '',
    images       JSONB            NOT NULL DEFAULT '[]',
    status       VARCHAR(20)      NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'inactive')),
    weight       NUMERIC(10,2)    NOT NULL DEFAULT 0,
    condition    VARCHAR(10)      NOT NULL DEFAULT 'new' CHECK (condition IN ('new', 'used')),
    min_purchase INT              NOT NULL DEFAULT 1,
    max_purchase INT              NOT NULL DEFAULT 0,
    created_at   TIMESTAMPTZ      NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ      NOT NULL DEFAULT NOW(),
    deleted_at   TIMESTAMPTZ,

    -- full-text search vector
    search_vector TSVECTOR GENERATED ALWAYS AS (
        setweight(to_tsvector('indonesian', coalesce(name, '')), 'A') ||
        setweight(to_tsvector('indonesian', coalesce(description, '')), 'C')
    ) STORED
);

CREATE INDEX idx_products_seller_id   ON products (seller_id)   WHERE deleted_at IS NULL;
CREATE INDEX idx_products_category_id ON products (category_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_products_status      ON products (status)      WHERE deleted_at IS NULL;
CREATE INDEX idx_products_slug        ON products (slug);
CREATE INDEX idx_products_search      ON products USING GIN(search_vector);
CREATE INDEX idx_products_name_trgm   ON products USING GIN(name gin_trgm_ops);

-- ============================================================
-- PRODUCT VARIANTS
-- ============================================================
CREATE TABLE IF NOT EXISTS product_variants (
    id            UUID          PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id    UUID          NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    sku           VARCHAR(100)  NOT NULL UNIQUE,
    name          VARCHAR(255)  NOT NULL,
    price         BIGINT        NOT NULL DEFAULT 0 CHECK (price >= 0),
    compare_price BIGINT        NOT NULL DEFAULT 0,
    cost_price    BIGINT        NOT NULL DEFAULT 0,
    stock         INT           NOT NULL DEFAULT 0 CHECK (stock >= 0),
    weight        NUMERIC(10,2) NOT NULL DEFAULT 0,
    images        JSONB         NOT NULL DEFAULT '[]',
    attributes    JSONB         NOT NULL DEFAULT '{}',
    is_active     BOOLEAN       NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_product_variants_product_id ON product_variants (product_id);
CREATE INDEX idx_product_variants_sku        ON product_variants (sku);

-- ============================================================
-- CARTS
-- ============================================================
CREATE TABLE IF NOT EXISTS carts (
    id         UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id    UUID        REFERENCES users(id) ON DELETE CASCADE,
    session_id VARCHAR(100) NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_carts_user_id    ON carts (user_id) WHERE user_id IS NOT NULL;
CREATE INDEX        idx_carts_session_id ON carts (session_id) WHERE session_id <> '';

-- ============================================================
-- CART ITEMS
-- ============================================================
CREATE TABLE IF NOT EXISTS cart_items (
    id         UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    cart_id    UUID        NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
    product_id UUID        NOT NULL REFERENCES products(id),
    variant_id UUID        NOT NULL REFERENCES product_variants(id),
    quantity   INT         NOT NULL DEFAULT 1 CHECK (quantity > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (cart_id, variant_id)
);

CREATE INDEX idx_cart_items_cart_id ON cart_items (cart_id);

-- ============================================================
-- VOUCHERS
-- ============================================================
CREATE TABLE IF NOT EXISTS vouchers (
    id           UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    code         VARCHAR(50)  NOT NULL UNIQUE,
    type         VARCHAR(20)  NOT NULL CHECK (type IN ('fixed', 'percentage', 'free_shipping')),
    amount       BIGINT       NOT NULL DEFAULT 0,
    max_discount BIGINT       NOT NULL DEFAULT 0,
    min_purchase BIGINT       NOT NULL DEFAULT 0,
    quota        INT          NOT NULL DEFAULT 0,
    used_count   INT          NOT NULL DEFAULT 0,
    is_active    BOOLEAN      NOT NULL DEFAULT TRUE,
    start_at     TIMESTAMPTZ  NOT NULL,
    end_at       TIMESTAMPTZ  NOT NULL,
    created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_vouchers_code ON vouchers (code);

-- ============================================================
-- ORDERS
-- ============================================================
CREATE TABLE IF NOT EXISTS orders (
    id               UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id          UUID        NOT NULL REFERENCES users(id),
    order_number     VARCHAR(30)  NOT NULL UNIQUE,
    status           VARCHAR(20)  NOT NULL DEFAULT 'pending'
                     CHECK (status IN ('pending','confirmed','processing','shipped','delivered','cancelled','refunded')),
    subtotal         BIGINT       NOT NULL DEFAULT 0,
    shipping_cost    BIGINT       NOT NULL DEFAULT 0,
    discount_amount  BIGINT       NOT NULL DEFAULT 0,
    tax_amount       BIGINT       NOT NULL DEFAULT 0,
    total            BIGINT       NOT NULL DEFAULT 0,
    notes            TEXT         NOT NULL DEFAULT '',
    shipping_address JSONB        NOT NULL DEFAULT '{}',
    payment_method   VARCHAR(50)  NOT NULL DEFAULT '',
    voucher_code     VARCHAR(50)  NOT NULL DEFAULT '',
    cancel_reason    TEXT         NOT NULL DEFAULT '',
    created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_orders_user_id      ON orders (user_id);
CREATE INDEX idx_orders_status       ON orders (status);
CREATE INDEX idx_orders_order_number ON orders (order_number);
CREATE INDEX idx_orders_created_at   ON orders (created_at DESC);

-- ============================================================
-- ORDER ITEMS
-- ============================================================
CREATE TABLE IF NOT EXISTS order_items (
    id           UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id     UUID        NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id   UUID        NOT NULL,
    variant_id   UUID        NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    variant_name VARCHAR(255) NOT NULL DEFAULT '',
    sku          VARCHAR(100) NOT NULL DEFAULT '',
    price        BIGINT       NOT NULL DEFAULT 0,
    quantity     INT          NOT NULL DEFAULT 1,
    subtotal     BIGINT       NOT NULL DEFAULT 0,
    image_url    TEXT         NOT NULL DEFAULT '',
    created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_order_items_order_id ON order_items (order_id);

-- ============================================================
-- PAYMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS payments (
    id                  UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id            UUID        NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    payment_method      VARCHAR(50)  NOT NULL,
    status              VARCHAR(20)  NOT NULL DEFAULT 'pending'
                        CHECK (status IN ('pending','paid','failed','refunded','expired')),
    amount              BIGINT       NOT NULL DEFAULT 0,
    gateway_provider    VARCHAR(50)  NOT NULL DEFAULT '',
    gateway_order_id    VARCHAR(100) NOT NULL DEFAULT '',
    gateway_payment_url TEXT         NOT NULL DEFAULT '',
    gateway_response    JSONB        NOT NULL DEFAULT '{}',
    paid_at             TIMESTAMPTZ,
    expired_at          TIMESTAMPTZ,
    created_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_payments_order_id         ON payments (order_id);
CREATE INDEX idx_payments_gateway_order_id ON payments (gateway_order_id) WHERE gateway_order_id <> '';

-- ============================================================
-- REVIEWS
-- ============================================================
CREATE TABLE IF NOT EXISTS reviews (
    id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID        NOT NULL REFERENCES users(id),
    product_id  UUID        NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    order_id    UUID        NOT NULL REFERENCES orders(id),
    rating      SMALLINT    NOT NULL CHECK (rating BETWEEN 1 AND 5),
    title       VARCHAR(255) NOT NULL DEFAULT '',
    body        TEXT         NOT NULL DEFAULT '',
    images      JSONB        NOT NULL DEFAULT '[]',
    is_approved BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

    UNIQUE (user_id, order_id, product_id)
);

CREATE INDEX idx_reviews_product_id  ON reviews (product_id);
CREATE INDEX idx_reviews_user_id     ON reviews (user_id);
CREATE INDEX idx_reviews_is_approved ON reviews (is_approved);

-- ============================================================
-- AUTO-UPDATE updated_at via trigger
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$ DECLARE
    tbl TEXT;
BEGIN
    FOREACH tbl IN ARRAY ARRAY[
        'users','addresses','categories','products','product_variants',
        'carts','cart_items','vouchers','orders','payments','reviews'
    ] LOOP
        EXECUTE format(
            'CREATE TRIGGER trg_%s_updated_at BEFORE UPDATE ON %s FOR EACH ROW EXECUTE FUNCTION update_updated_at()',
            tbl, tbl
        );
    END LOOP;
END $$;

-- ============================================================
-- SEED: Default admin user (password: Admin@12345)
-- ============================================================
INSERT INTO users (id, email, password_hash, full_name, role, is_active, email_verified_at)
VALUES (
    uuid_generate_v4(),
    'admin@ecommerce.local',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- Admin@12345 (bcrypt)
    'Super Admin',
    'admin',
    TRUE,
    NOW()
) ON CONFLICT (email) DO NOTHING;
