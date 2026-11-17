package io.github.prclin.datastudio.server.infrastructure.persistence.mybatis;

import org.apache.ibatis.type.BaseTypeHandler;
import org.apache.ibatis.type.JdbcType;
import org.apache.ibatis.type.MappedJdbcTypes;
import org.apache.ibatis.type.MappedTypes;
import org.postgresql.util.PGobject;

import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.UUID;

@MappedTypes({UUID.class})
@MappedJdbcTypes(JdbcType.OTHER)
public class UUIDTypeHandler extends BaseTypeHandler<UUID> {

    @Override
    public void setNonNullParameter(PreparedStatement ps, int i, UUID parameter, JdbcType jdbcType) throws SQLException {
        PGobject uuid = new PGobject();
        uuid.setType("uuid");
        uuid.setValue(parameter.toString());
        ps.setObject(i, uuid);
    }

    public UUID getNullableResult(ResultSet rs, String columnName) throws SQLException {
        String res = rs.getString(columnName);

        return res == null ? null : UUID.fromString(res);
    }

    public UUID getNullableResult(ResultSet rs, int columnIndex) throws SQLException {
        String res = rs.getString(columnIndex);
        return res == null ? null : UUID.fromString(res);
    }

    public UUID getNullableResult(CallableStatement cs, int columnIndex) throws SQLException {
        String res = cs.getString(columnIndex);
        return res == null ? null : UUID.fromString(res);
    }
}
