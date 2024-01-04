import Image from "next/image";
import logoImg from "/public/images/logo.png";

export default function Header() {
	return (
		<header>
			<h1 className="flex justify-center items-center py-3">
				<Image src={logoImg} alt="logo" width={30} height={30} />
			</h1>
		</header>
	);
}
