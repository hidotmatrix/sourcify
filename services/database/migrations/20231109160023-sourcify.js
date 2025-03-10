"use strict";

var async = require("async");

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db, callback) {
  async.series(
    [
      db.runSql.bind(
        db,
        `ALTER TABLE contracts ALTER COLUMN creation_code_hash DROP NOT NULL;`
      ),
      db.runSql.bind(
        db,
        `ALTER TABLE contract_deployments ALTER COLUMN transaction_hash DROP NOT NULL;
        ALTER TABLE contract_deployments ALTER COLUMN block_number DROP NOT NULL;
        ALTER TABLE contract_deployments ALTER COLUMN transaction_index DROP NOT NULL;
        ALTER TABLE contract_deployments ALTER COLUMN deployer DROP NOT NULL;`
      ),
      db.runSql.bind(
        db,
        `ALTER TABLE compiled_contracts ALTER COLUMN creation_code_hash DROP NOT NULL;
        ALTER TABLE compiled_contracts ALTER COLUMN creation_code_artifacts DROP NOT NULL;`
      ),
      db.runSql.bind(
        db,
        `CREATE TABLE sourcify_matches (
            id BIGSERIAL NOT NULL,
            verified_contract_id BIGSERIAL NOT NULL,
            creation_match varchar NULL,
            runtime_match varchar NULL,
            created_at timestamptz NOT NULL DEFAULT now(),
            CONSTRAINT sourcify_matches_pkey PRIMARY KEY (id),
            CONSTRAINT sourcify_matches_pseudo_pkey UNIQUE (verified_contract_id)
        );
        CREATE INDEX sourcify_matches_verified_contract_id_idx ON sourcify_matches USING btree (verified_contract_id);
        ALTER TABLE sourcify_matches ADD CONSTRAINT sourcify_matches_verified_contract_id_fk FOREIGN KEY (verified_contract_id) REFERENCES verified_contracts(id) ON DELETE RESTRICT ON UPDATE RESTRICT;`
      ),
      db.runSql.bind(
        db,
        `CREATE TABLE sourcify_sync (
            id BIGSERIAL NOT NULL,
            chain_id numeric NOT NULL,
            address bytea NOT NULL,
            match_type varchar NOT NULL,
            synced bool NOT NULL DEFAULT false,
            created_at timestamptz NOT NULL DEFAULT now(),
            CONSTRAINT sourcify_sync_pkey PRIMARY KEY (id),
            CONSTRAINT sourcify_sync_pseudo_pkey UNIQUE (chain_id, address)
        );`
      ),
      // db.runSql.bind(
      //   db,
      //   `CREATE TABLE session (
      //     sid character varying NOT NULL,
      //     sess json NOT NULL,
      //     expire timestamp with time zone NOT NULL,
      //     CONSTRAINT session_pk PRIMARY KEY (sid)
      //   );`
      // ),
    ],
    callback
  );
};

exports.down = function (db, callback) {
  async.series(
    [
      db.dropTable.bind(db, "sourcify_sync"),
      db.dropTable.bind(db, "sourcify_matches"),
    ],
    callback
  );
};
