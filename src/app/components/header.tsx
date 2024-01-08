import Image from "next/image";
import logoImg from "/public/images/logo.png";

type HeaderProps = {
	height: string;
};

export default function Header(props: HeaderProps) {
	return (
		<header
			className={`flex justify-center items-center h-[${props.height}] py-3`}
		>
			<h1>
				<Image src={logoImg} alt="logo" width={35} height={35} />
			</h1>
		</header>
	);
}
