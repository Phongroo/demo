export default class Global {
    permission = "";
    static setPermission = (per) => {
        this.permission = per;
    };

    static getPermission = () => {
        return this.permission;
    };
}
