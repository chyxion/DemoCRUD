package demo.services;
import com.shs.framework.core.BaseService;
import com.shs.framework.core.ExtStore;
import com.shs.framework.utils.UUID;

public class UserService extends BaseService {
	public ExtStore list() {
		return new ExtStore(dao, params) {
			@Override
			protected void run() throws Exception {
				setSQL("select id, name, gender from users");
				orderBy("name", ASC);
			}
		};
	}
	/**
	 * 新建用户
	 * @return
	 * @throws Exception
	 */
	public String newUser() throws Exception {
		notBlank("user.name", "请输入用户名！");
		String id = UUID.get();
		dao.insert("users", params.getJSONObject("user").put("id", id));
		return id;
	}
	/**
	 * 更新用户
	 */
	public void updateUser() {
		dao.update("users", params.getJSONObject("user"), params.getJSONObject("where"));
	}
	/**
	 * 删除用户
	 */
	public void delete() {
		dao.update("delete from users where id in (?)", params.getJSONArray("ids"));
	}
}
