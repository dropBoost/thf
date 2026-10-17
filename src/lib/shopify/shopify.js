import "server-only";

const API_VERSION = "2026-07";

async function shopifyFetch(query, variables = {}) {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN;

  if (!domain || !token) {
    throw new Error("Configurazione Shopify mancante in .env.local");
  }

  const response = await fetch(
    `https://${domain}/api/${API_VERSION}/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Shopify-Storefront-Private-Token": token,
      },
      body: JSON.stringify({ query, variables }),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(`Errore Shopify HTTP ${response.status}`);
  }

  const result = await response.json();

  if (result.errors?.length) {
    throw new Error(
      result.errors.map((error) => error.message).join(", ")
    );
  }

  return result.data;
}

export async function getProducts({ first = 20, after = null } = {}) {
  const query = `
    query GetProducts($first: Int!, $after: String) {
      products(first: $first, after: $after) {
        nodes {
          id
          handle
          title
          description
          descriptionHtml
          vendor
          productType
          availableForSale

          seo {
            title
            description
          }

          featuredImage {
            url
            altText
          }

          images(first: 10) {
            nodes {
              url
              altText
              width
              height
            }
          }

          options {
            name
            optionValues {
              name
            }
          }

          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
            maxVariantPrice {
              amount
              currencyCode
            }
          }

          metafields(
            identifiers: [
              { namespace: "custom", key: "categoria" }
            ]
          ) {
            namespace
            key
            type
            value
          }

          variants(first: 20) {
            nodes {
              id
              title
              sku
              availableForSale
              quantityAvailable

              selectedOptions {
                name
                value
              }

              price {
                amount
                currencyCode
              }

              compareAtPrice {
                amount
                currencyCode
              }

              image {
                url
                altText
              }
            }

            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }

        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  `;

  const data = await shopifyFetch(query, { first, after });

  return data.products;
}

export async function getProductByHandle(handle) {
  const query = `
    query GetProduct($handle: String!) {
      product(handle: $handle) {
        id
        handle
        title
        description
        featuredImage {
          url
          altText
        }
      }
    }
  `;

  const data = await shopifyFetch(query, { handle });

  return data.product;
}

export async function getProductByID(id) {
  if (!id) {
    throw new Error("ID prodotto Shopify mancante");
  }

  const query = `
    query GetProductByID($id: ID!) {
      product(id: $id) {
        id
        handle
        title
        description
        descriptionHtml
        vendor
        productType
        availableForSale

        seo {
          title
          description
        }

        featuredImage {
          url
          altText
        }

        images(first: 10) {
          nodes {
            url
            altText
            width
            height
          }
        }

        options {
          name
          optionValues {
            name
          }
        }

        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
          maxVariantPrice {
            amount
            currencyCode
          }
        }

        metafields(
          identifiers: [
            { namespace: "custom", key: "primo_campo" }
            { namespace: "custom", key: "secondo_campo" }
          ]
        ) {
          namespace
          key
          type
          value
        }

        variants(first: 20) {
          nodes {
            id
            title
            sku
            availableForSale
            quantityAvailable

            selectedOptions {
              name
              value
            }

            price {
              amount
              currencyCode
            }

            compareAtPrice {
              amount
              currencyCode
            }

            image {
              url
              altText
            }
          }

          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    }
  `;

  const data = await shopifyFetch(query, { id });

  return data.product;
}