package demo.controllers;
import com.shs.framework.core.BaseController;
import demo.services.UserService;

public class UserController extends BaseController {
	private UserService service;
	public void list() {
		success(service.list());
	}
	/**
	 * 新建用户
	 * @throws Exception
	 */
	public void newUser() throws Exception {
		success(service.newUser());
	}
	public void update() {
		service.updateUser();
	}
	public void delete() {
		service.delete();
	}
}
